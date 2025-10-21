import React, { useEffect, useMemo, useState } from "react";
import { hideDemoModal } from "../../lib/demoModal";
import { demoBookingApi, CreateDemoBookingData } from "../../services/demoBookingApi";

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

const focusableSelectors = [
  "a[href]",
  "button:not([disabled])",
  "textarea",
  "input[type='text']",
  "input[type='email']",
  "input[type='tel']",
  "select",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

export const DemoModal: React.FC<DemoModalProps> = ({ open, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateDemoBookingData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    preferredDate: '',
    preferredTime: '',
    companySize: '',
    referralSource: ''
  });

  const handleKeyDown = useMemo(
    () => (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
      if (event.key === "Tab") {
        const dialog = document.getElementById("demo-modal-content");
        if (!dialog) return;
        const focusable = dialog.querySelectorAll<HTMLElement>(focusableSelectors);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            event.preventDefault();
          }
        } else if (document.activeElement === last) {
          first.focus();
          event.preventDefault();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimeout = window.setTimeout(() => {
      const dialog = document.getElementById("demo-modal-content");
      const focusTarget = dialog?.querySelector<HTMLElement>(focusableSelectors);
      focusTarget?.focus();
    }, 50);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimeout);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown, open]);

  if (!open) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await demoBookingApi.createDemoBooking(formData);
      
      if (result.success) {
        setIsSubmitted(true);
        // Reset form after 3 seconds and close modal
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: '',
            email: '',
            company: '',
            phone: '',
            message: '',
            preferredDate: '',
            preferredTime: '',
            companySize: '',
            referralSource: ''
          });
          close();
        }, 3000);
      } else {
        setError(result.message || 'Failed to submit demo booking');
      }
    } catch (error) {
      console.error('Error submitting demo booking:', error);
      setError('Network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const close = () => {
    hideDemoModal();
    onClose();
    // Reset form when closing
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      message: '',
      preferredDate: '',
      preferredTime: '',
      companySize: '',
      referralSource: ''
    });
    setError(null);
    setIsSubmitted(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 backdrop-blur-sm px-4 sm:px-6"
      onClick={close}
    >
      <div
        id="demo-modal-content"
        className="relative grid max-w-5xl gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-black via-black/95 to-black/90 p-1 sm:p-10 lg:grid-cols-[1.15fr_1fr]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute lg:right-4 -right-4 lg:top-4 -top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-white/40 hover:text-white"
          aria-label="Close demo modal"
        >
          ×
        </button>

        <div className="lg:flex hidden flex-col gap-6 text-white/80">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#fd8a0d]/80">
            Request a walkthrough
          </p>
          <h2 id="demo-modal-title" className="text-3xl sm:text-4xl font-bold text-white/90">
            See how AiPRL unifies in-store and digital service
          </h2>
          <p className="text-sm sm:text-base text-white/60">
            Share a few details and our retail orchestration team will tailor a working session for your storefronts. Expect ROI projections, automation guardrails, and training plans built for teams on the floor.
          </p>
          <ul className="grid gap-4 text-sm text-white/65">
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-[#fd8a0d]" />
              <span>Live demo of AI-assisted chat, SMS, and phone flows your associates can manage.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-[#fd8a0d]" />
              <span>Baseline performance review with clear readiness checklist for go-live in 30 days.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-[#fd8a0d]" />
              <span>Playbooks for human-in-the-loop handoffs so your brand voice stays intact.</span>
            </li>
          </ul>
        </div>

        <form
          className="flex flex-col w-full gap-4 rounded-2xl border border-white/10 bg-white/[0.04] lg:p-6 p-3 shadow-black/20"
          onSubmit={handleSubmit}
        >
          {/* Success Message */}
          {isSubmitted && (
            <div className="rounded-xl bg-green-500/20 border border-green-500/30 p-4 text-center">
              <div className="text-green-400 font-semibold mb-2">✅ Demo Request Submitted!</div>
              <p className="text-green-300 text-sm">Our team will contact you within one business day.</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-xl bg-red-500/20 border border-red-500/30 p-4 text-center">
              <div className="text-red-400 font-semibold mb-2">❌ Error</div>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-white/60">
              Full name *
              <input
                name="name"
                required
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Alex Rivera"
                className="rounded-xl border border-white/15 bg-black/40 lg:px-4 px-3 lg:py-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#fd8a0d] focus:outline-none focus:ring-2 focus:ring-[#fd8a0d]/40"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-white/60">
              Work email *
              <input
                name="email"
                required
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="alex@brand.com"
                className="rounded-xl border border-white/15 bg-black/40 lg:px-4 px-3 lg:py-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#fd8a0d] focus:outline-none focus:ring-2 focus:ring-[#fd8a0d]/40"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-white/60">
              Company / storefront name *
              <input
                name="company"
                required
                type="text"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Brightline Retail"
                className="rounded-xl border border-white/15 bg-black/40 lg:px-4 px-3 lg:py-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#fd8a0d] focus:outline-none focus:ring-2 focus:ring-[#fd8a0d]/40"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-white/60">
              Phone number
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                className="rounded-xl border border-white/15 bg-black/40 lg:px-4 px-3 lg:py-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#fd8a0d] focus:outline-none focus:ring-2 focus:ring-[#fd8a0d]/40"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-white/60">
              Company size
              <select
                name="companySize"
                value={formData.companySize}
                onChange={handleInputChange}
                className="rounded-xl border border-white/15 bg-black/40 lg:px-4 px-3 lg:py-3 py-2 text-sm text-white focus:border-[#fd8a0d] focus:outline-none focus:ring-2 focus:ring-[#fd8a0d]/40"
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-white/60">
              How did you hear about us?
              <select
                name="referralSource"
                value={formData.referralSource}
                onChange={handleInputChange}
                className="rounded-xl border border-white/15 bg-black/40 lg:px-4 px-3 lg:py-3 py-2 text-sm text-white focus:border-[#fd8a0d] focus:outline-none focus:ring-2 focus:ring-[#fd8a0d]/40"
              >
                <option value="">Select referral source</option>
                <option value="google">Google Search</option>
                <option value="social-media">Social Media</option>
                <option value="referral">Referral</option>
                <option value="advertisement">Advertisement</option>
                <option value="event">Event/Conference</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-white/60">
              Preferred date
              <input
                name="preferredDate"
                type="date"
                value={formData.preferredDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="rounded-xl border border-white/15 bg-black/40 lg:px-4 px-3 lg:py-3 py-2 text-sm text-white focus:border-[#fd8a0d] focus:outline-none focus:ring-2 focus:ring-[#fd8a0d]/40"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-white/60">
              Preferred time
              <select
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleInputChange}
                className="rounded-xl border border-white/15 bg-black/40 lg:px-4 px-3 lg:py-3 py-2 text-sm text-white focus:border-[#fd8a0d] focus:outline-none focus:ring-2 focus:ring-[#fd8a0d]/40"
              >
                <option value="">Select preferred time</option>
                <option value="morning">Morning (9 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                <option value="evening">Evening (5 PM - 8 PM)</option>
                <option value="flexible">Flexible</option>
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-white/60">
            Primary goal for this demo
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Tell us what you want to improve for your team or customers."
              className="resize-none rounded-xl border border-white/15 bg-black/40 lg:px-4 px-3 lg:py-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#fd8a0d] focus:outline-none focus:ring-2 focus:ring-[#fd8a0d]/40"
            />
          </label>

          <div className="flex flex-col gap-3 rounded-xl bg-black/40 p-4 text-xs text-white/45">
            <span className="font-semibold uppercase tracking-[0.25em] text-white/60">
              What happens next
            </span>
            <p>
              Our retail experts will reach out within one business day to confirm time, align on objectives, and curate your live environment.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isSubmitted}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-[#fd8a0d] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#ff9c24] focus:outline-none focus:ring-2 focus:ring-[#fd8a0d]/60 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : isSubmitted ? (
              'Submitted!'
            ) : (
              'Schedule my demo'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};