import heroMain from '../assets/Imagecontent.png';
import heroAutomation from '../assets/GraphicContent/Logo.png';
import heroHumanLoop from '../assets/GraphicContent/User.png';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tag: string;
  author: string;
  heroImage?: string;
  body: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "ai-assisted-service",
    title: "How Retail Teams Launch AI-Assisted Service In 30 Days",
    excerpt:
      "See the playbook brick-and-mortar teams use to unify chat, SMS, and email without slowing down operations.",
    date: "Sept 10, 2025",
    readingTime: "6 min read",
    tag: "Customer Experience",
    author: "Amelia Hart | VP Activation",
    heroImage: heroMain,
    body: [
      "Launch automation without sacrificing the in-store experience. We outline the four-week sprint that AiPRL coaches run with new teams, including training cadences and quick wins your associates feel immediately.",
      "Week one focuses on mapping the frontline conversations that create the most friction. We pair those with high-intent AI responses that maintain brand voice, and we give store leadership the dashboards they need to approve every change.",
    ],
  },
  {
    id: "automation-metrics",
    title: "Automation Metrics That Actually Predict Revenue",
    excerpt:
      "We break down the three engagement metrics our top retailers track weekly to grow repeat revenue.",
    date: "Aug 28, 2025",
    readingTime: "5 min read",
    tag: "Automation",
    author: "Louis Meyer | Director of Insights",
    heroImage: heroAutomation,
    body: [
      "Revenue-leading teams obsess over three numbers: first response accuracy, follow-up velocity, and conversion momentum. We show how these metrics change when automation is tuned to mirror store-level promotions.",
      "Use our tracker template to review conversations every Friday. If automations dip below your guardrails, the system flags them for human review before they impact revenue.",
    ],
  },
  {
    id: "human-in-the-loop",
    title: "Keeping The Human In The Loop Without Slowing Down",
    excerpt:
      "Learn how AiPRL routes complex conversations to the right specialist while AI handles the busy work.",
    date: "Jul 31, 2025",
    readingTime: "8 min read",
    tag: "Operations",
    author: "Priya Banerjee | Principal Strategist",
    heroImage: heroHumanLoop,
    body: [
      "Human-in-the-loop is not a buzzword; it is the reason your floor looks effortless. We share how AiPRL routes spikes in demand to specialists without dropping compliance or personalization.",
      "Schedule two micro-coaching sessions per month to keep automations honest. When the AI sees something it has not mastered, it taps your best people, learns, and improves the next morning.",
    ],
  },
];