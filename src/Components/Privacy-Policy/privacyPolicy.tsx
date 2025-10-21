"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

// Navigation items for the sidebar
const NAVIGATION_ITEMS = [
  { id: "introduction", label: "Introduction", href: "#introduction" },
  { id: "owner-controller", label: "Owner and Data Controller", href: "#owner-controller" },
  { id: "data-collection", label: "Types of Data Collected", href: "#data-collection" },
  { id: "data-processing", label: "Mode and Place of Data Processing", href: "#data-processing" },
  { id: "retention", label: "Retention Time", href: "#retention" },
  { id: "purposes", label: "Purposes of Processing", href: "#purposes" },
  { id: "communication", label: "Communication and Consent", href: "#communication" },
  { id: "third-party", label: "Third-Party Services", href: "#third-party" },
  { id: "processing-activities", label: "Processing Activities", href: "#processing-activities" },
  { id: "user-rights", label: "User Rights", href: "#user-rights" },
  { id: "cookie-policy", label: "Cookie Policy", href: "#cookie-policy" },
  { id: "additional-info", label: "Additional Information", href: "#additional-info" },
  { id: "policy-changes", label: "Changes to Privacy Policy", href: "#policy-changes" },
  { id: "ccpa", label: "Information for Californian Consumers (CCPA)", href: "#ccpa" },
  { id: "lgpd", label: "Information for Brazilian Users (LGPD)", href: "#lgpd" },
  { id: "contact", label: "Contact Information", href: "#contact" },
];

// Content sections
const PRIVACY_CONTENT = {
  introduction: {
    title: "Privacy Policy",
    subtitle: "AiPRL Assist Privacy Policy",
    content: `AiPRL Assist ("we", "us", "our") is committed to protecting the privacy of our users ("you", "your"). This Privacy Policy outlines how we collect, use, disclose, and safeguard your personal information when you use our services.

Please read this policy carefully to understand our views and practices regarding your personal data.`
  },
  "owner-controller": {
    title: "Owner and Data Controller",
    content: `AiPRL Assist LLC
525 N Tryon
Charlotte, NC 28202
📧 Email: support@aiprlassist.com`
  },
  "data-collection": {
    title: "Types of Data Collected",
    content: `We collect various types of personal data, including:

**Identifiers:** Email address, first name, last name, phone number.
**Payment Information:** Credit card details, billing information.
**Usage Data:** IP address, browser type, usage patterns.
**Service Communication Data:** Information you provide during service interactions.
**Various Additional Data:** As specified within this Policy or notices at data collection points.

All requested data is mandatory unless stated otherwise. For non-mandatory data, declining to provide it won't affect service functionality.

For uncertainties regarding data requirements, please contact us via the "Owner and Data Controller" information.

We also use cookies and other tracking technologies — see our Cookie Policy for more information.`
  },
  "data-processing": {
    title: "Mode and Place of Data Processing",
    content: `**Methods of Processing**
We secure your data through organizational procedures, IT tools, and security measures.
Data access is limited to:

- Internal teams (sales, marketing, legal, administration)
- External partners (hosting providers, IT services, communication agencies), bound by strict confidentiality agreements.

**Legal Basis of Processing**
Your data may be processed based on:

- Consent
- Contractual Necessity
- Legal Obligation
- Public Interest/Official Authority
- Legitimate Interests

For questions about the legal basis, please contact us.

**Place of Processing**
Your data is processed in North Carolina and other locations where processing parties operate. Data transfers outside the U.S. are performed under appropriate safeguards.`
  },
  retention: {
    title: "Retention Time",
    content: `We retain your personal data only for as long as necessary:

- **Contracts:** Until fully performed.
- **Legitimate Interests:** As needed to fulfill those purposes.
- **Consent:** Until consent is withdrawn.
- **Legal Obligations:** As required.

Once retention ends, personal data will be deleted.`
  },
  purposes: {
    title: "Purposes of Processing",
    content: `We process your data for:

- Providing and improving services
- Legal compliance
- Fraud detection and security
- Marketing, analytics, hosting, payment processing, and user communication

Detailed breakdowns can be found in the "Detailed Information on the Processing of Personal Data" section.`
  },
  communication: {
    title: "Communication and Consent",
    content: `By providing your information, you consent to:

- Receiving texts, emails, and calls related to transactions, promotions, and updates.
- Communications possibly using automated systems, with standard rates applying.

**Opting Out:**
- Reply "STOP" to texts, click "unsubscribe" in emails, or request opt-out during calls.

**Note:** Essential service messages may still be sent even after opting out of marketing.`
  },
  "third-party": {
    title: "Third-Party Services",
    content: `- **Google API Services:** We comply with Google's Limited Use requirements.
- **Facebook Permissions:** We may access basic info, manage pages, Instagram engagement, etc.

See their respective Privacy Policies for more.`
  },
  "processing-activities": {
    title: "Detailed Information on Processing Activities",
    content: `Data is used for:

- Access to third-party accounts
- Advertising and remarketing
- Analytics
- Payment handling
- Hosting and backend infrastructure
- Live chat interaction
- User registration and authentication
- Tag management`
  },
  "user-rights": {
    title: "User Rights",
    content: `You have the right to:

- Withdraw consent at any time
- Object to data processing
- Access your data
- Verify and rectify inaccuracies
- Request data erasure
- Restrict processing
- Port your data to another provider
- Lodge a complaint with a regulatory authority

**How to Exercise Rights:**
Contact us via the "Owner and Data Controller" information.`
  },
  "cookie-policy": {
    title: "Cookie Policy",
    content: `AiPRL Assist uses cookies to:

- Enable essential site functionality
- Improve performance and usability
- Personalize content and ads

Manage cookies through your browser settings. See our Cookie Policy for full details.`
  },
  "additional-info": {
    title: "Additional Information",
    content: `- **Legal Action:** We may disclose data for legal obligations.
- **System Logs and Maintenance:** Technical maintenance may involve personal data collection.
- **No Do Not Track Support:** Check third-party services individually for DNT policies.`
  },
  "policy-changes": {
    title: "Changes to This Privacy Policy",
    content: `- Changes to this policy are effective immediately upon posting.
- Significant changes may be notified through the service or by email.
- We encourage you to review this Privacy Policy regularly.

**Last Updated:** January 24, 2025`
  },
  ccpa: {
    title: "Information for Californian Consumers (CCPA)",
    content: `This section supplements the main policy and applies to California residents.

**Categories of Personal Information Collected**
- Identifiers (name, email, phone)
- Commercial Information (transaction details)
- Network Activity Information (browsing, search history)
- Inferred Information (preferences, interests)

**Sources:** Direct user input, service usage, third-party data providers.

**Use and Sharing of Information**
We may share information with third parties for business purposes under confidentiality agreements.

**Sale of Personal Information**
We may "sell" data (as defined by CCPA) for advertising and analytics.
**Opt-Out:** Contact us to opt out of any sales.

**Your California Privacy Rights**
- Right to Know
- Right to Delete
- Right to Opt-Out of Sales
- Right to Non-Discrimination

Submit verifiable requests using our contact details.`
  },
  lgpd: {
    title: "Information for Brazilian Users (LGPD)",
    content: `This section supplements the main policy and applies to Brazilian residents.

**Legal Basis for Processing**
Includes:

- Consent
- Legal Obligations
- Contractual Execution
- Legitimate Interests
- Research and Public Interest

**Brazilian Privacy Rights**
- Confirm the existence of data processing
- Access and portability of your data
- Rectify, anonymize, block, or delete your data
- Revoke consent
- File complaints with ANPD

**How to Exercise Rights:**
Submit a request via the contact information provided.`
  },
  contact: {
    title: "Contact Information",
    content: `AiPRL Assist LLC
123 Innovation Drive
Raleigh, North Carolina 27601, USA

📧 Email: support@aiprlassist.com
📞 Phone: (555) 123-4567`
  }
};

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSectionName, setCurrentSectionName] = useState("Introduction");
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle smooth scrolling navigation
  const handleNavigation = useCallback((href: string, sectionId: string) => {
    const target = document.querySelector(href);
    if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
      setCurrentSectionName(NAVIGATION_ITEMS.find(item => item.id === sectionId)?.label || "");
      setIsMobileMenuOpen(false);
    }
  }, []);

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = NAVIGATION_ITEMS.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      })).filter(section => section.element);

      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          setCurrentSectionName(NAVIGATION_ITEMS.find(item => item.id === section.id)?.label || "");
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Breadcrumb */}
      <div className="lg:hidden sticky top-0 z-40 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <Menu className="h-5 w-5" />
            <span className="text-sm font-medium">{currentSectionName}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 top-0 h-full w-80 bg-black/95 border-r border-white/10 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white">Privacy Policy</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              <nav className="space-y-2">
                {NAVIGATION_ITEMS.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNavigation(item.href, item.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer",
                      activeSection === item.id
                        ? "bg-[#fd8a0d] text-black font-semibold"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 bg-black/95 border-r border-white/10 sticky top-0 h-screen overflow-y-auto scrollbar-hide">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-white mb-8">Privacy Policy</h1>
            <nav className="space-y-2">
              {NAVIGATION_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.href, item.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer",
                    activeSection === item.id
                      ? "bg-[#fd8a0d] text-black font-semibold"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen overflow-y-auto scrollbar-hide">
          <div ref={contentRef} className="max-w-4xl mx-auto p-8 space-y-16">
            {Object.entries(PRIVACY_CONTENT).map(([key, section]) => (
              <motion.section
                key={key}
                id={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="scroll-mt-24"
              >
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6 border-b border-[#fd8a0d]/30 pb-4">
                    {section.title}
                  </h2>
                  {'subtitle' in section && section.subtitle && (
                    <h3 className="text-xl text-[#fd8a0d] mb-4 font-semibold">
                      {section.subtitle}
                    </h3>
                  )}
                  <div className="prose prose-invert max-w-none">
                    <div className="text-white/80 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
