# Tool Calling Implementation Guide

## Overview

This document explains the tool calling implementation for the AiPRL chat agent. The system enables the AI to automatically schedule appointments and submit support tickets by calling an n8n webhook that handles the actual execution.

## Architecture

### Flow Diagram
```
User Message 
    → OpenAI (with tools defined)
    → Tool Call Detected?
        → YES: Format parameters → Call n8n webhook → Get result → OpenAI (final response) → User
        → NO: Direct response → User
```

## Implementation Details

### 1. Tool Definitions

Two tools are defined in `/api-webhook/index.js`:

#### `schedule_appointment`
- **Purpose**: Schedule appointments on Google Calendar
- **Required Parameters**:
  - `name`: Full name of the person
  - `email`: Email address
  - `phone`: Phone number
  - `company_name`: Company name
  - `appointment_datetime`: Natural language date/time (e.g., "Next Monday at 2 PM CST")
- **Optional Parameters**:
  - `company_website`: Company website URL
  - `notes`: Additional context

#### `submit_ticket`
- **Purpose**: Submit support tickets via email
- **Required Parameters**:
  - `name`: Full name
  - `email`: Email address
  - `phone`: Phone number
  - `subject`: Ticket subject
  - `description`: Detailed description of the issue

### 2. Helper Functions

#### `formatToolInstruction(toolName, parameters)`
Located in `/api-webhook/index.js` (lines 340-380)

Converts structured tool parameters into a natural language instruction that the n8n agent can understand.

**Example output for `schedule_appointment`**:
```
Schedule an appointment for John Doe (email: john@example.com, phone: +1234567890) 
from Acme Corp (website: acme.com) on Next Monday at 2 PM CST. 
Current time is 2025-10-24T14:30:00.000Z. Send confirmation email to john@example.com.
```

**Example output for `submit_ticket`**:
```
Create a support ticket from Jane Smith (email: jane@example.com, phone: +1987654321). 
Subject: Cannot access dashboard. Description: Getting 404 error when clicking dashboard link. 
Send confirmation email to jane@example.com and notify the support team.
```

#### `callN8nWebhook(instruction, userId)`
Located in `/api-webhook/index.js` (lines 307-338)

Calls the n8n webhook with the formatted instruction and user ID.

**Endpoint**: `https://drivedevelopment.app.n8n.cloud/webhook/84b59153-ebea-475d-ad72-9ce89dd164a8`

**Payload**:
```json
{
  "message": "the complete natural language instruction",
  "id": "user_unique_identifier"
}
```

### 3. Main Tool Calling Logic

Located in `/api/webhook` endpoint (lines 717-763)

**Process**:
1. User sends a message
2. OpenAI receives the message along with tool definitions
3. If OpenAI decides to call a tool:
   - Extract tool name and parameters
   - Format parameters into natural language using `formatToolInstruction()`
   - Call n8n webhook using `callN8nWebhook()`
   - Add tool call and result to conversation history
   - Get final response from OpenAI incorporating the tool result
4. Return response to user

### 4. Updated System Prompt

The system prompt has been updated to:
- Inform the AI about available tools
- Guide the AI to collect all necessary information before calling tools
- Emphasize natural conversation flow
- Clarify when to use each tool

Key changes (lines 458, 592-614):
- Added instructions for when to use tools
- Simplified appointment booking process
- Simplified ticket submission process
- Emphasized collecting information from conversation history

## n8n Agent Configuration

The n8n agent receives the instruction and handles:
1. **Calendar Tool**: Schedules events on Google Calendar
2. **Gmail Tool**: Sends confirmation emails

The n8n agent uses the current timestamp (`{{ $now }}`) to calculate relative dates like "tomorrow" or "next Monday".

## User Experience

### Appointment Booking Flow

1. **User**: "I'd like to book an appointment"
2. **AI**: Asks for name, email, phone
3. **User**: Provides information
4. **AI**: Asks for company name and website
5. **User**: Provides information
6. **AI**: Asks for preferred date/time
7. **User**: "Next Monday at 3 PM"
8. **AI**: Confirms details
9. **User**: "Yes, book it"
10. **AI**: Calls `schedule_appointment` tool → n8n schedules → AI confirms "Your appointment is scheduled for Monday at 3 PM. Confirmation email sent!"

### Support Ticket Flow

1. **User**: "I need to talk to support"
2. **AI**: Offers to submit a ticket
3. **User**: "Yes please"
4. **AI**: Asks for name, email, phone
5. **User**: Provides information
6. **AI**: Asks for subject and description
7. **User**: Provides details
8. **AI**: Calls `submit_ticket` tool → n8n creates ticket → AI confirms "Support ticket created! Our team will reach out soon."

## Key Features

### ✅ Shared User Identity
- Both text and voice interactions share the same `userId`
- Tool calls from either channel are associated with the same user
- Conversation history is unified

### ✅ Natural Language Processing
- User can say "tomorrow at 2 PM" or "Next Friday at 10:30 AM"
- n8n agent handles the date/time parsing
- AI extracts information from conversation naturally

### ✅ Error Handling
- If n8n webhook fails, error is returned to AI
- AI can inform user and suggest alternatives
- All errors are logged with detailed context

### ✅ Conversation Context
- AI remembers information mentioned earlier in the conversation
- Won't ask for information already provided
- Can extract emails, names, etc. from natural conversation

## Testing

### Test Appointment Booking
```
User: "I want to schedule a demo"
AI: "Great! What's your name and email?"
User: "John Doe, john@example.com, +1234567890"
AI: "What's your company name?"
User: "Acme Corp"
AI: "When would you like to schedule it?"
User: "Tomorrow at 2 PM"
AI: "Should I book it?"
User: "Yes"
[Tool executes]
AI: "Done! Confirmation sent to john@example.com"
```

### Test Support Ticket
```
User: "I need help with my account"
AI: "I can submit a support ticket. What's your name, email, and phone?"
User: "Jane Smith, jane@example.com, +1987654321"
AI: "What's the issue?"
User: "Subject: Account access, Description: Can't login"
[Tool executes]
AI: "Ticket submitted! Support will contact you soon."
```

## Logging

All tool calls are logged with:
- `[N8N WEBHOOK]` - Webhook calls and responses
- `[TEXT CHAT]` - Main conversation flow and tool detection
- Tool name, arguments, and results

Check logs with:
```bash
# If deployed on Railway
railway logs --follow

# Local development
npm start
```

## Maintenance

### Updating Tool Parameters
1. Modify tool definition in `/api-webhook/index.js` (lines 628-703)
2. Update `formatToolInstruction()` function to handle new parameters (lines 340-380)
3. Update system prompt to instruct AI on collecting new parameters (lines 592-614)

### Changing n8n Webhook URL
Update the `N8N_WEBHOOK_URL` constant in `callN8nWebhook()` function (line 309)

### Adding New Tools
1. Add tool definition to `tools` array (after line 703)
2. Add case in `formatToolInstruction()` function
3. Update system prompt with instructions for the new tool

## Environment Variables

No new environment variables required. The system uses existing:
- `OPENAI_API_KEY` - For OpenAI API access
- `DATABASE_URL` - For conversation storage

## Dependencies

No new dependencies required. Uses existing:
- `openai` - OpenAI API client
- Built-in `fetch` - For n8n webhook calls (Node.js 18+)

## Known Limitations

1. **Sequential Tool Calls**: If AI wants to call multiple tools in one turn, they execute sequentially
2. **Webhook Timeout**: If n8n takes > 30 seconds, the request may timeout
3. **No Tool Call Retry**: Failed tool calls are not automatically retried
4. **Date Format**: Relies on n8n agent to parse natural language dates correctly

## Future Enhancements

- [ ] Add retry logic for failed webhook calls
- [ ] Support parallel tool execution
- [ ] Add tool call confirmation UI
- [ ] Store tool execution results in database
- [ ] Add analytics for tool usage
- [ ] Support voice-initiated tool calls (currently text only)

## Summary

The implementation successfully adds tool calling to the main chat agent using:
- OpenAI's function calling API
- Natural language instruction formatting
- n8n webhook integration
- Unified user identity across channels

The system maintains a conversational, natural user experience while automating appointment scheduling and support ticket submission.

