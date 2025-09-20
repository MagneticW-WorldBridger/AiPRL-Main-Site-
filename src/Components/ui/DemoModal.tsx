import React, { useEffect, useMemo } from "react";
import { hideDemoModal } from "../../lib/demoModal";

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

  const close = () => {
    hideDemoModal();
    onClose();
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
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            console.table(Object.fromEntries(formData.entries()));
            close();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-white/60">
              Full name
              <input
                name="name"
                required
                type="text"
                placeholder="Alex Rivera"
                className="rounded-xl border border-white/15 bg-black/40 lg:px-4 px-3 lg:py-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#fd8a0d] focus:outline-none focus:ring-2 focus:ring-[#fd8a0d]/40"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-white/60">
              Work email
              <input
                name="email"
                required
                type="email"
                placeholder="alex@brand.com"
                className="rounded-xl border border-white/15 bg-black/40 lg:px-4 px-3 lg:py-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#fd8a0d] focus:outline-none focus:ring-2 focus:ring-[#fd8a0d]/40"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-white/60">
            Company / storefront name
            <input
              name="company"
              type="text"
              placeholder="Brightline Retail"
              className="rounded-xl border border-white/15 bg-black/40 lg:px-4 px-3 lg:py-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#fd8a0d] focus:outline-none focus:ring-2 focus:ring-[#fd8a0d]/40"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-white/60">
            Primary goal for this demo
            <textarea
              name="goal"
              rows={4}
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
            className="mt-2 inline-flex items-center justify-center rounded-full bg-[#fd8a0d] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#ff9c24] focus:outline-none focus:ring-2 focus:ring-[#fd8a0d]/60"
          >
            Schedule my demo
          </button>
        </form>
      </div>
    </div>
  );
};