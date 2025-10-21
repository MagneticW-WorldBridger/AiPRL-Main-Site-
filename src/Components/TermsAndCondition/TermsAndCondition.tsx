"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

// Navigation items for the sidebar
const NAVIGATION_ITEMS = [
  { id: "introduction", label: "Introduction", href: "#introduction" },
  { id: "acceptance", label: "Acceptance of Terms", href: "#acceptance" },
  { id: "eligibility", label: "Eligibility", href: "#eligibility" },
  { id: "services", label: "Services Provided", href: "#services" },
  { id: "user-responsibilities", label: "User Responsibilities", href: "#user-responsibilities" },
  { id: "prohibited-activities", label: "Prohibited Activities", href: "#prohibited-activities" },
  { id: "intellectual-property", label: "Intellectual Property", href: "#intellectual-property" },
  { id: "account-management", label: "Account Management", href: "#account-management" },
  { id: "limitation-liability", label: "Limitation of Liability", href: "#limitation-liability" },
  { id: "disclaimer", label: "Disclaimer of Warranties", href: "#disclaimer" },
  { id: "indemnification", label: "Indemnification", href: "#indemnification" },
  { id: "governing-law", label: "Governing Law", href: "#governing-law" },
  { id: "changes-terms", label: "Changes to Terms", href: "#changes-terms" },
  { id: "contact", label: "Contact Us", href: "#contact" },
];

// Content sections
const TERMS_CONTENT = {
  introduction: {
    title: "Terms and Conditions",
    subtitle: "AiPRL Assist Terms & Conditions",
    content: `Welcome to AiPRL Assist ("we," "our," "us"). By accessing or using our website (www.aiprlassist.com) and related services, you agree to comply with and be bound by these Terms of Service ("Terms"). Please read them carefully before using our services.`
  },
  acceptance: {
    title: "Acceptance of Terms",
    content: `By accessing or using AiPRL Assist, you agree to these Terms and our Privacy Policy. If you do not agree, you must not use our services.`
  },
  eligibility: {
    title: "Eligibility",
    content: `To use our services, you must:

- Be at least 18 years old (or the legal age of majority in your jurisdiction).
- Have the legal capacity to enter into binding agreements.`
  },
  services: {
    title: "Services Provided",
    content: `AiPRL Assist provides AI-powered tools and services designed to empower retailers with AI-driven sales, marketing, customer service, and operational support. The features and functionality of the service may change without prior notice.`
  },
  "user-responsibilities": {
    title: "User Responsibilities",
    content: `You agree to:

- Provide accurate and complete information during registration or interactions.
- Use our services only for lawful purposes.

You agree NOT to:

- Engage in illegal activities using our services.
- Attempt to gain unauthorized access to our systems.
- Upload malicious software or harmful content.`
  },
  "prohibited-activities": {
    title: "Prohibited Activities",
    content: `You may not:

- Reverse engineer, decompile, or disassemble our software.
- Use the services to violate any applicable laws or regulations.
- Exploit the services for unauthorized commercial purposes.`
  },
  "intellectual-property": {
    title: "Intellectual Property",
    content: `All content, trademarks, logos, and intellectual property associated with AiPRL Assist are owned by us or our licensors. You may not use, reproduce, or distribute any of our intellectual property without explicit permission.`
  },
  "account-management": {
    title: "Account Management",
    content: `**Account Security:** You are responsible for maintaining the confidentiality of your account credentials.

**Account Termination:** We reserve the right to suspend or terminate accounts that violate these Terms or engage in prohibited activities.`
  },
  "limitation-liability": {
    title: "Limitation of Liability",
    content: `To the fullest extent permitted by law, AiPRL Assist is not liable for:

- Indirect, incidental, or consequential damages arising from your use of our services.
- Loss of data, profits, or business opportunities resulting from service interruptions or errors.`
  },
  disclaimer: {
    title: "Disclaimer of Warranties",
    content: `Our services are provided "as is" and "as available" without warranties of any kind, express or implied. We do not guarantee uninterrupted or error-free operation of the services.`
  },
  indemnification: {
    title: "Indemnification",
    content: `You agree to indemnify and hold AiPRL Assist harmless from any claims, liabilities, damages, or expenses arising from your violation of these Terms or misuse of our services.`
  },
  "governing-law": {
    title: "Governing Law",
    content: `These Terms are governed by and construed in accordance with the laws of The State of North Carolina. Any disputes will be subject to the exclusive jurisdiction of courts in North Carolina.`
  },
  "changes-terms": {
    title: "Changes to Terms",
    content: `We reserve the right to update these Terms at any time. Changes will be posted on this page with the revised "Effective Date." Continued use of our services constitutes acceptance of the updated Terms.`
  },
  contact: {
    title: "Contact Us",
    content: `If you have questions or concerns about these Terms, please contact us:

📧 Email: info@aiprlassist.com

Thank you for using AiPRL Assist. We value your trust and commitment.`
  }
};

export default function TermsAndCondition() {
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
                <h2 className="text-xl font-bold text-white">Terms & Conditions</h2>
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
            <h1 className="text-2xl font-bold text-white mb-8">Terms & Conditions</h1>
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
            {Object.entries(TERMS_CONTENT).map(([key, section]) => (
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
