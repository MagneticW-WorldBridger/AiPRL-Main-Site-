# Tool Calling Testing Guide

## Pre-Test Checklist

### 1. Verify n8n Webhook is Running
Test the webhook manually:
```bash
curl -X POST https://drivedevelopment.app.n8n.cloud/webhook/84b59153-ebea-475d-ad72-9ce89dd164a8 \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Schedule an appointment for Test User (email: test@example.com, phone: +1234567890) from Test Corp on tomorrow at 2 PM. Current time is 2025-10-24T14:00:00.000Z. Send confirmation email to test@example.com.",
    "id": "test_user_123"
  }'
```

Expected response: A confirmation message from n8n

### 2. Deploy or Run the API
```bash
cd api-webhook
npm start
```

### 3. Test from Frontend
Open your web chat interface and test the flows below.

## Test Scenarios

### Test 1: Complete Appointment Booking Flow

**Test Case**: Book an appointment with all information provided

**User Messages**:
```
1. "I want to schedule a demo"
2. "My name is John Doe, email is john@example.com, and phone is +1234567890"
3. "Acme Corporation"
4. "www.acme.com"
5. "Tomorrow at 2 PM CST"
6. "Yes, please book it"
```

**Expected AI Behavior**:
1. AI asks for name, email, phone
2. AI acknowledges and asks for company name
3. AI asks for website
4. AI asks for preferred date/time
5. AI confirms all details and asks for final confirmation
6. AI calls `schedule_appointment` tool
7. AI confirms: "Your appointment is scheduled! Confirmation email sent."

**Verification**:
- Check n8n logs for webhook call
- Check Google Calendar for new event
- Check email for confirmation
- Check API logs for `[N8N WEBHOOK]` entries

---

### Test 2: Appointment Booking with Information in History

**Test Case**: AI should extract information from earlier messages

**User Messages**:
```
1. "Hi, I'm Jane from Tech Solutions, jane@techsolutions.com, +19876543210"
2. "I'd like to schedule a demo"
3. "Next Monday at 3 PM"
4. "Yes"
```

**Expected AI Behavior**:
1. AI greets user
2. AI asks for company name (since not mentioned) and date/time
3. AI confirms details (should already have name, email, phone from first message)
4. AI calls tool
5. AI confirms booking

**Verification**:
- AI should NOT ask for name/email/phone again
- Tool should receive all correct parameters

---

### Test 3: Support Ticket Submission

**Test Case**: Submit a support ticket

**User Messages**:
```
1. "I need to talk to support"
2. "Yes, submit a ticket"
3. "Bob Smith, bob@example.com, +1555123456"
4. "Cannot access dashboard"
5. "When I click the dashboard link, I get a 404 error. Started happening this morning."
```

**Expected AI Behavior**:
1. AI offers to submit a ticket
2. AI asks for name, email, phone
3. AI asks for subject
4. AI asks for description
5. AI calls `submit_ticket` tool
6. AI confirms: "Support ticket created! Our team will reach out soon."

**Verification**:
- Check n8n logs for webhook call
- Check email for ticket confirmation
- Check support system for new ticket

---

### Test 4: Multi-Language Support

**Test Case**: Test in Spanish

**User Messages**:
```
1. "Hola, quiero programar una cita"
2. "Mi nombre es Carlos García, carlos@ejemplo.com, +34612345678"
3. "Mi Empresa SA"
4. "Mañana a las 10 de la mañana"
5. "Sí"
```

**Expected AI Behavior**:
- AI responds in Spanish
- Collects all information
- Calls tool with properly formatted English instruction for n8n
- Confirms in Spanish

**Verification**:
- AI maintains Spanish throughout conversation
- n8n receives English instruction
- Tool executes successfully

---

### Test 5: Handling Missing Information

**Test Case**: User doesn't provide all info upfront

**User Messages**:
```
1. "Book me an appointment"
2. "John"
3. "Forgot to mention, it's john@email.com"
4. "+1234567890"
5. "ABC Inc"
6. "Friday at 11 AM"
7. "Yes"
```

**Expected AI Behavior**:
- AI asks for each piece of information step by step
- AI is patient and doesn't get confused
- AI confirms before calling tool
- Tool executes successfully

**Verification**:
- All parameters correctly passed to n8n
- No missing required fields

---

### Test 6: User Changes Mind

**Test Case**: User cancels during collection

**User Messages**:
```
1. "I want to schedule an appointment"
2. "Actually, never mind. I'll do it later"
```

**Expected AI Behavior**:
- AI asks initial questions
- AI acknowledges cancellation
- AI offers to help with something else
- **NO tool call should be made**

**Verification**:
- Check logs - no `[N8N WEBHOOK]` calls
- AI remains helpful and available

---

### Test 7: Error Handling

**Test Case**: n8n webhook is down (simulate by using wrong URL)

**Temporary Change** (for testing only):
```javascript
// In index.js, line 309, temporarily change:
const N8N_WEBHOOK_URL = 'https://invalid-url.com/webhook';
```

**User Messages**:
```
1. Complete appointment booking flow
```

**Expected AI Behavior**:
- AI collects information normally
- Tool call fails
- AI responds: "I'm having trouble scheduling right now. Please try again in a moment or contact us at info@aiprlassist.com"

**Verification**:
- Error logged in console
- User receives helpful error message
- Conversation can continue

**Remember**: Revert the URL change after testing!

---

### Test 8: Rapid-Fire Messages

**Test Case**: User sends everything at once

**User Messages**:
```
1. "Hi I'm Sarah from XYZ Corp sarah@xyz.com +1222333444 and I want to book an appointment for next Tuesday at 4 PM please"
```

**Expected AI Behavior**:
- AI extracts all information from one message
- AI may ask for website if needed
- AI confirms all details
- After confirmation, calls tool

**Verification**:
- AI successfully parses complex message
- All fields populated correctly
- Tool executes properly

---

### Test 9: International Phone Format

**Test Case**: Test various phone formats

**User Messages**:
```
Test A: "+44 20 7946 0958" (UK)
Test B: "+33 1 42 86 82 00" (France)
Test C: "2125551234" (US, no country code)
Test D: "+1 (212) 555-1234" (US, formatted)
```

**Expected AI Behavior**:
- AI accepts all formats
- Formats are passed to n8n as-is
- Tool executes successfully for all

**Verification**:
- n8n receives phone numbers correctly
- Calendar events/emails sent properly

---

### Test 10: Edge Case - Past Date

**Test Case**: User tries to book in the past

**User Messages**:
```
1. "Book appointment for yesterday at 3 PM"
```

**Expected AI Behavior**:
- AI politely explains that appointments must be in the future
- AI asks for a different date/time
- Does NOT call tool until valid date provided

**Verification**:
- No tool call with past date
- AI handles gracefully

---

## Monitoring During Tests

### Watch API Logs
```bash
# Terminal 1 - Watch API logs
cd api-webhook
npm start
```

### Watch n8n Execution Logs
Open n8n dashboard and monitor:
- Webhook executions
- Calendar API calls
- Gmail API calls
- Any errors

### Watch Frontend Console
Open browser DevTools and monitor:
- Network requests to `/api/webhook`
- Console logs for errors
- Response times

## Success Criteria

✅ All 10 test scenarios pass  
✅ No errors in API logs  
✅ n8n executions successful  
✅ Calendar events created correctly  
✅ Confirmation emails sent  
✅ AI responses are natural and helpful  
✅ Conversation history maintained  
✅ User identity preserved across sessions  

## Troubleshooting

### Tool not being called?
1. Check OpenAI logs - is tool_calls present in response?
2. Check system prompt - are instructions clear?
3. Check tool descriptions - are they accurate?

### n8n webhook not receiving calls?
1. Test webhook URL manually with curl
2. Check firewall/network settings
3. Verify webhook URL is correct in code

### Parameters missing in tool call?
1. Check conversation history in logs
2. Verify AI collected all information
3. Check tool parameter definitions

### AI asking for info already provided?
1. Check conversation history is being loaded
2. Verify system prompt emphasizes using history
3. Check if info was in different format

## Next Steps After Testing

1. ✅ Verify all tests pass
2. 📝 Document any issues found
3. 🚀 Deploy to production
4. 📊 Monitor real user interactions
5. 🔧 Iterate based on user feedback

## Production Monitoring

Set up monitoring for:
- Tool call success rate
- n8n webhook response times
- Error rates
- User satisfaction
- Calendar API limits
- Email sending limits

## Support Contact

If issues arise:
- Check logs first: `[N8N WEBHOOK]`, `[TEXT CHAT]`, `[TOOL CALL]`
- Review this document
- Test manually with curl
- Contact n8n support if webhook issues
- Contact OpenAI support if AI behavior issues

