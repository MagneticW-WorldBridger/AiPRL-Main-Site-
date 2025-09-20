import React, { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    ktt10: { setup: (config: any) => void };
    vapiSDK: { run: (config: any) => any };
    ChatbotAPI: {
      startVoice: () => Promise<void>;
      stopVoice: () => void;
      startChat: () => void;
      isVoiceActive: () => boolean;
      getCurrentMode: () => string;
      showNotification: (msg: string, type?: string, duration?: number) => void;
      getVapiInstance: () => any;
      showVapi: () => void;
      hideVapi: () => void;
      showStatusBar: (state?: string) => void;
      hideStatusBar: () => void;
    };
  }
}

interface ChatbotWidgetProps {}

const AIPRL_CONFIG = {
  ktt10: {
    accountId: '1047143',
    id: 'xaLiCGQ3VYp6mQF2k',
    color: '#cfcfcf',
    icon: 'https://images.squarespace-cdn.com/content/v1/66d9b3459bce7d5bd7aa6964/7399117d-ff46-4541-a15f-c02123216d77/AiPRL+Just+Logo.png',
    type: 'floating',
  },
  vapi: {
    assistant: 'e7a8d3c6-7806-4f81-a431-183391a9615c',
    apiKey: '18fc48e4-a0d2-4c54-af1c-140ddfb96b97',
    sdkSrc: 'https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js',
  },
};

const ChatbotWidget: React.FC<ChatbotWidgetProps> = () => {
  const vapiInstanceRef = useRef<any>(null);
  const vapiLoadedRef = useRef(false);
  const vapiConfigRef = useRef<any>(null);
  const popupDismissedRef = useRef(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [currentMode, setCurrentMode] = useState<'chat' | 'voice'>('chat');

  const $ = useCallback((selector: string) => document.querySelector(selector), []);

  const notify = useCallback(
    (msg: string, type: string = 'info', duration: number = 3000) => {
      const el = $('#notification') as HTMLElement | null;
      if (!el) return;
      el.textContent = msg;
      el.className = `notification ${type}`;
      el.style.display = 'block';
      window.setTimeout(() => {
        el.style.display = 'none';
      }, duration);
    },
    [$],
  );

  const showPopup = useCallback(() => {
    if (popupDismissedRef.current) return;
    const popup = $('#custom-popup') as HTMLElement | null;
    if (popup) popup.style.display = 'flex';
  }, [$]);

  const hidePopup = useCallback(() => {
    const popup = $('#custom-popup') as HTMLElement | null;
    if (popup) popup.style.display = 'none';
  }, [$]);

  const showStatus = useCallback(
    (state: string = 'idle') => {
      const bar = $('#vapi-status-bar') as HTMLElement | null;
      if (!bar) return;
      if (state === 'idle') {
        bar.style.display = 'none';
        return;
      }
      bar.className = `vapi-status-bar ${state}`;
      bar.style.display = 'block';
      bar.textContent = state === 'loading' ? 'CONNECTING' : 'IN PROGRESS';
    },
    [$],
  );

  const hideStatus = useCallback(() => {
    const bar = $('#vapi-status-bar') as HTMLElement | null;
    if (bar) bar.style.display = 'none';
  }, [$]);

  const hideKtt10 = useCallback(() => {
    const button = $('.ktt10-btn') as HTMLElement | null;
    if (button) button.classList.add('voice-mode-hidden');
  }, [$]);

  const showKtt10 = useCallback(() => {
    const button = $('.ktt10-btn') as HTMLElement | null;
    if (button) button.classList.remove('voice-mode-hidden');
  }, [$]);

  const clampVapiButton = useCallback(() => {
    const btn = $('.vapi-btn') as HTMLElement | null;
    if (!btn) return;

    btn.style.setProperty('overflow', 'hidden', 'important');
    btn.style.setProperty('border-radius', '50%', 'important');

    let icon = btn.querySelector('#vapi-icon-container') as HTMLElement | null;
    if (!icon) {
      icon = document.createElement('div');
      icon.id = 'vapi-icon-container';
      while (btn.firstChild) {
        icon.appendChild(btn.firstChild);
      }
      btn.appendChild(icon);
    }

    const sizeProps = ['width', 'height', 'max-width', 'max-height', 'min-width', 'min-height'];
    sizeProps.forEach((prop) => icon!.style.setProperty(prop, '50px', 'important'));
    icon!.style.setProperty('overflow', 'hidden', 'important');
    icon!.style.setProperty('position', 'absolute', 'important');
    icon!.style.setProperty('top', '50%', 'important');
    icon!.style.setProperty('left', '50%', 'important');
    icon!.style.setProperty('transform', 'translate(-50%,-50%)', 'important');
    icon!.style.setProperty('border-radius', '50%', 'important');
    icon!.style.setProperty('background', 'rgba(255,255,255,.18)', 'important');

    const clampIcons = () => {
      icon!.querySelectorAll('img,svg').forEach((el) => {
        const node = el as HTMLElement;
        node.style.setProperty('width', '28px', 'important');
        node.style.setProperty('height', '28px', 'important');
        node.style.setProperty('max-width', '28px', 'important');
        node.style.setProperty('max-height', '28px', 'important');
        node.style.setProperty('display', 'block', 'important');
        node.style.setProperty('object-fit', 'contain', 'important');
        node.style.setProperty('overflow', 'hidden', 'important');
        node.style.setProperty('position', 'absolute', 'important');
        node.style.setProperty('top', '25%', 'important');
        node.style.setProperty('left', '25%', 'important');
        if (node.tagName.toLowerCase() === 'img') {
          node.style.setProperty('filter', 'brightness(0) invert(1)', 'important');
        }
      });
    };

    clampIcons();
    const observer = new MutationObserver(clampIcons);
    observer.observe(icon!, { childList: true, subtree: true, attributes: true });
    window.addEventListener('resize', clampIcons, { passive: true });
  }, [$]);

  const initVapiTextBlock = useCallback(() => {
    const ensure = () => {
      const btn = $('.vapi-btn') as HTMLElement | null;
      if (!btn) {
        window.setTimeout(ensure, 200);
        return;
      }

      let container = $('.vapi-widget-container') as HTMLElement | null;
      if (!container) {
        container = document.createElement('div');
        container.className = 'vapi-widget-container';
        btn.parentNode?.insertBefore(container, btn);
        container.appendChild(btn);
      }

      if (!$('#vapi-text-block')) {
        const block = document.createElement('div');
        block.id = 'vapi-text-block';
        block.className = 'vapi-text-block idle';
        block.textContent = 'Have a Voice Chat with AiPRL';
        container.insertBefore(block, btn);
      }

      clampVapiButton();

      const update = (state: 'idle' | 'loading' | 'active') => {
        const block = $('#vapi-text-block') as HTMLElement | null;
        if (!block) return;
        block.className = `vapi-text-block ${state}`;
        block.textContent =
          state === 'loading'
            ? 'Connecting...'
            : state === 'active'
            ? 'Call in Progress\nEnd Call'
            : 'Have a Voice Chat with AiPRL';
        if (state === 'idle') hideStatus();
        else showStatus(state);
      };

      const observer = new MutationObserver(() => {
        const cls = btn.className;
        const background = getComputedStyle(btn).backgroundColor;
        const isLoading = !!(cls.includes('vapi-btn-is-loading') || (background && background.includes('253, 203, 110')));
        const isActive = !!(cls.includes('vapi-btn-is-active') || (background && background.includes('255, 107, 107')));
        btn.classList.toggle('state-loading', isLoading);
        btn.classList.toggle('state-active', isActive);
        update(isLoading ? 'loading' : isActive ? 'active' : 'idle');
        clampVapiButton();
      });

      observer.observe(btn, { attributes: true, attributeFilter: ['class', 'style'] });
    };

    window.setTimeout(ensure, 120);
  }, [$, clampVapiButton, hideStatus, showStatus]);

  const ensureVapiButton = useCallback(() => {
    const btn = $('.vapi-btn');
    if (!btn && window.vapiSDK && vapiConfigRef.current) {
      vapiInstanceRef.current = window.vapiSDK.run(vapiConfigRef.current);
      vapiLoadedRef.current = true;
    }
    clampVapiButton();
  }, [$, clampVapiButton]);

  const removeCloseBtn = useCallback(() => {
    const node = $('#vapi-close-btn') as HTMLElement | null;
    if (node) node.remove();
  }, [$]);

  const hideVapi = useCallback(() => {
    const btn = $('.vapi-btn') as HTMLElement | null;
    const container = $('.vapi-widget-container') as HTMLElement | null;
    if (btn) {
      btn.style.display = 'none';
      btn.style.visibility = 'hidden';
      btn.style.opacity = '0';
    }
    if (container) {
      container.style.display = 'none';
      container.style.visibility = 'hidden';
      container.style.opacity = '0';
    }
    removeCloseBtn();
  }, [$, removeCloseBtn]);

  const removeFloatingFooter = useCallback(() => {
    const footer = $('#floating-footer') as HTMLElement | null;
    if (footer) footer.remove();
  }, [$]);

  const stopVoice = useCallback(() => {
    setIsVoiceActive(false);
    setCurrentMode('chat');
    hideStatus();
    showKtt10();
    hideVapi();
    removeFloatingFooter();
    try {
      const instance = vapiInstanceRef.current;
      if (instance && typeof instance.stop === 'function') {
        instance.stop();
      }
    } catch (error) {
      console.error('Error stopping Vapi instance:', error);
    }
    notify('Voice mode deactivated', 'warning');
  }, [hideStatus, hideVapi, notify, removeFloatingFooter, showKtt10]);

  const addCloseBtn = useCallback(() => {
    removeCloseBtn();
    const btn = document.createElement('div');
    btn.id = 'vapi-close-btn';
    btn.className = 'vapi-close-btn';
    btn.title = 'End voice session';
    btn.textContent = '×';
    btn.style.cssText =
      'position:fixed;right:20px;bottom:420px;width:40px;height:40px;border-radius:50%;background:#dc3545;color:#fff;' +
      'display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:bold;cursor:pointer;z-index:10001;box-shadow:0 6px 20px rgba(0,0,0,0.25);transition:transform .2s ease';
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.05)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
    });
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      event.preventDefault();
      stopVoice();
    });
    document.body.appendChild(btn);
  }, [removeCloseBtn, stopVoice]);

  const showVapi = useCallback(() => {
    window.setTimeout(() => {
      ensureVapiButton();
      const btn = $('.vapi-btn') as HTMLElement | null;
      let container = $('.vapi-widget-container') as HTMLElement | null;
      if (!btn) return;

      if (!container) {
        container = document.createElement('div');
        container.className = 'vapi-widget-container';
        btn.parentNode?.insertBefore(container, btn);
        container.appendChild(btn);
      }

      container.style.display = 'flex';
      container.style.visibility = 'visible';
      container.style.opacity = '1';

      btn.style.display = 'flex';
      btn.style.visibility = 'visible';
      btn.style.opacity = '1';

      addCloseBtn();
      clampVapiButton();
      initVapiTextBlock();
    }, 120);
  }, [$, addCloseBtn, clampVapiButton, ensureVapiButton, initVapiTextBlock]);

  const setChatTabAsDefault = useCallback(() => {
    const footer = $('.chat-footer') as HTMLElement | null;
    if (!footer) return;
    footer.querySelector('#chat-btn')?.classList.add('active');
    const voiceBtn = footer.querySelector('.voice-btn') as HTMLElement | null;
    voiceBtn?.classList.remove('active', 'voice-active');
    const status = footer.querySelector('#voice-status') as HTMLElement | null;
    status?.classList.remove('active', 'connecting');
  }, [$]);

  const startChat = useCallback(() => {
    setCurrentMode('chat');
    hideStatus();
    hideVapi();
    removeFloatingFooter();
    showKtt10();

    const trigger = $('.ktt10-btn') as HTMLElement | null;
    if (trigger) {
      const container = $('.ktt10-flt') as HTMLElement | null;
      if (!container || container.style.display === 'none') {
        trigger.click();
      }
    }

    window.setTimeout(setChatTabAsDefault, 200);
    notify('Chat mode activated 💬');
  }, [$, hideStatus, hideVapi, notify, removeFloatingFooter, setChatTabAsDefault, showKtt10]);

  const createFloatingFooter = useCallback(() => {
    removeFloatingFooter();
    const footer = document.createElement('div');
    footer.id = 'floating-footer';
    footer.className = 'chat-footer floating';
    footer.innerHTML = `
      <button class="chat-mode-btn" id="floating-chat">
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        Chat
      </button>
      <button class="chat-mode-btn voice-btn active" id="floating-voice">
        <svg viewBox="0 0 24 24"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>
        Voice
      </button>
    `;
    document.body.appendChild(footer);
    footer.querySelector('#floating-chat')?.addEventListener('click', startChat);
    footer
      .querySelector('#floating-voice')
      ?.addEventListener('click', () => notify('Voice mode is already active'));
  }, [notify, removeFloatingFooter, startChat]);

  const loadVapi = useCallback(() => {
    if (vapiLoadedRef.current) {
      ensureVapiButton();
      return Promise.resolve(vapiInstanceRef.current);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = AIPRL_CONFIG.vapi.sdkSrc;
      script.defer = true;
      script.async = true;

      script.onload = () => {
        vapiConfigRef.current = {
          apiKey: AIPRL_CONFIG.vapi.apiKey,
          assistant: AIPRL_CONFIG.vapi.assistant,
          config: {
            position: 'bottom-right',
            offset: '20px',
            width: '70px',
            height: '70px',
            idle: {
              color: 'rgb(116, 185, 255)',
              type: 'round',
              title: 'Have a Voice Chat with AiPRL',
              subtitle: 'Click to start',
              icon: 'https://www.svgrepo.com/show/520848/mic.svg',
            },
            loading: {
              color: 'rgb(253, 203, 110)',
              type: 'round',
              title: 'Connecting...',
              subtitle: 'Please wait',
              icon: 'https://www.svgrepo.com/show/520848/mic.svg',
            },
            active: {
              color: 'rgb(255, 107, 107)',
              type: 'round',
              title: 'Call in Progress',
              subtitle: 'Click to end call',
              icon: 'https://www.svgrepo.com/show/520849/mic-off.svg',
            },
          },
        };
        vapiInstanceRef.current = window.vapiSDK.run(vapiConfigRef.current);
        vapiLoadedRef.current = true;
        window.setTimeout(() => {
          clampVapiButton();
          initVapiTextBlock();
          hideVapi();
        }, 120);
        resolve(vapiInstanceRef.current);
      };

      script.onerror = () => reject(new Error('Failed to load Vapi SDK'));
      document.head.appendChild(script);
    });
  }, [clampVapiButton, ensureVapiButton, hideVapi, initVapiTextBlock]);

  const startVoice = useCallback(async () => {
    setIsVoiceActive(true);
    setCurrentMode('voice');
    notify('Loading voice AI...');
    try {
      await loadVapi();
      hideKtt10();
      showVapi();

      const toggle = $('.ktt10-btn') as HTMLElement | null;
      const chat = $('.ktt10-flt') as HTMLElement | null;
      if (toggle && chat && chat.style.display !== 'none') {
        toggle.click();
      }

      window.setTimeout(createFloatingFooter, 400);
      notify('Voice mode activated! 🎤');
    } catch (error) {
      setIsVoiceActive(false);
      setCurrentMode('chat');
      showKtt10();
      hideStatus();
      notify('Failed to load voice AI', 'error');
      throw error;
    }
  }, [$, createFloatingFooter, hideKtt10, hideStatus, loadVapi, notify, showKtt10, showVapi]);

  const enhanceChat = useCallback(() => {
    const container = $('.ktt10-flt') as HTMLElement | null;
    if (!container || container.style.display === 'none' || container.querySelector('.chat-footer')) {
      setChatTabAsDefault();
      return;
    }

    const footer = document.createElement('div');
    footer.className = 'chat-footer';
    footer.innerHTML = `
      <button class="chat-mode-btn active" id="chat-btn">
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        Chat
      </button>
      <button class="chat-mode-btn voice-btn" id="voice-btn">
        <svg viewBox="0 0 24 24"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>
        Voice
        <span class="voice-status" id="voice-status"></span>
      </button>
    `;

    container.appendChild(footer);

    const chatBtn = footer.querySelector('#chat-btn') as HTMLElement | null;
    const voiceBtn = footer.querySelector('#voice-btn') as HTMLElement | null;
    const voiceStatus = footer.querySelector('#voice-status') as HTMLElement | null;

    chatBtn?.addEventListener('click', () => {
      startChat();
    });

    voiceBtn?.addEventListener('click', () => {
      voiceBtn.classList.add('active');
      chatBtn?.classList.remove('active');
      voiceBtn.classList.add('voice-active');
      if (voiceStatus) voiceStatus.className = 'voice-status connecting';
      notify('Switching to voice mode...');
      window.setTimeout(async () => {
        try {
          await startVoice();
          if (voiceStatus) voiceStatus.className = 'voice-status active';
        } catch (error) {
          if (voiceStatus) voiceStatus.className = 'voice-status';
          voiceBtn.classList.remove('active', 'voice-active');
          chatBtn?.classList.add('active');
          notify('Voice mode failed', 'error');
        }
      }, 600);
    });
  }, [$, notify, setChatTabAsDefault, startChat, startVoice]);

  const monitorChat = useCallback(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'childList' ||
          (mutation.type === 'attributes' &&
            mutation.target instanceof HTMLElement &&
            mutation.target.classList.contains('ktt10-flt'))
        ) {
          window.setTimeout(() => {
            enhanceChat();
            setChatTabAsDefault();
          }, 150);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });
  }, [enhanceChat, setChatTabAsDefault]);

  useEffect(() => {
    if (window.ktt10) {
      window.ktt10.setup(AIPRL_CONFIG.ktt10);
    } else {
      console.error('KTT10 SDK not found on window. Make sure plugin.js is loaded.');
    }

    const popupText = $('#custom-popup-text');
    const popupClose = $('#custom-popup-close');

    const handlePopupTextClick = () => {
      const btn = $('.ktt10-btn') as HTMLElement | null;
      if (btn) btn.click();
      popupDismissedRef.current = true;
      hidePopup();
    };

    const handlePopupCloseClick = (event: Event) => {
      event.stopPropagation();
      hidePopup();
    };

    popupText?.addEventListener('click', handlePopupTextClick);
    popupClose?.addEventListener('click', handlePopupCloseClick);

    const handleKtt10BtnClick = (event: MouseEvent) => {
      if ((event.target as HTMLElement | null)?.closest('.ktt10-btn')) {
        setCurrentMode('chat');
        window.setTimeout(() => {
          enhanceChat();
          setChatTabAsDefault();
        }, 450);
        popupDismissedRef.current = true;
        hidePopup();
      }
    };

    document.addEventListener('click', handleKtt10BtnClick);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'V') {
        event.preventDefault();
        startVoice();
      }
      if (event.ctrlKey && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        startChat();
      }
      if (event.key === 'Escape' && isVoiceActive) {
        event.preventDefault();
        stopVoice();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    window.ChatbotAPI = {
      startVoice,
      stopVoice,
      startChat,
      isVoiceActive: () => isVoiceActive,
      getCurrentMode: () => currentMode,
      showNotification: notify,
      getVapiInstance: () => vapiInstanceRef.current,
      showVapi,
      hideVapi,
      showStatusBar: showStatus,
      hideStatusBar: hideStatus,
    };

    showPopup();
    window.setTimeout(() => {
      enhanceChat();
      monitorChat();
    }, 800);
    console.log('AiPRL Chat + Voice ready. Use window.ChatbotAPI.*');

    return () => {
      popupText?.removeEventListener('click', handlePopupTextClick);
      popupClose?.removeEventListener('click', handlePopupCloseClick);
      document.removeEventListener('click', handleKtt10BtnClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    $, currentMode, enhanceChat, hidePopup, hideStatus, hideVapi, isVoiceActive, monitorChat, notify, setChatTabAsDefault,
    showPopup, showStatus, startChat, startVoice, stopVoice,
  ]);

  return (
    <>
      <div id="custom-popup">
        <span id="custom-popup-text" style={{ fontFamily: 'Arial' }}>
          Need Help? Get Instant Answers
        </span>
        <button id="custom-popup-close">&times;</button>
      </div>
      <div id="notification" className="notification" />
      <div id="vapi-status-bar" className="vapi-status-bar" />
    </>
  );
};

export default ChatbotWidget;