const EVENT_NAME = "demo-modal:toggle";

export type DemoModalEventDetail = {
  open: boolean;
};

export const showDemoModal = () => {
  document.dispatchEvent(
    new CustomEvent<DemoModalEventDetail>(EVENT_NAME, {
      detail: { open: true }
    })
  );
};

export const hideDemoModal = () => {
  document.dispatchEvent(
    new CustomEvent<DemoModalEventDetail>(EVENT_NAME, {
      detail: { open: false }
    })
  );
};

export const subscribeToDemoModal = (
  handler: (detail: DemoModalEventDetail) => void
) => {
  const listener = (event: Event) => {
    const customEvent = event as CustomEvent<DemoModalEventDetail>;
    handler(customEvent.detail);
  };

  document.addEventListener(EVENT_NAME, listener as EventListener);
  return () => document.removeEventListener(EVENT_NAME, listener as EventListener);
};