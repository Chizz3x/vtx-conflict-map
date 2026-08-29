import React, { createContext, useContext, useCallback, useRef, useState } from 'react';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      render: (
        container: string | HTMLElement,
        params: { sitekey: string; callback: (token: string) => void; size: string },
      ) => number;
      execute: (widgetId: number) => Promise<string>;
    };
    __recaptcha_loading?: boolean;
    __recaptcha_onload?: () => void;
  }
}

interface IRecaptchaContext {
  executeRecaptcha: (action?: string) => Promise<string>;
}

const RecaptchaContext = createContext<IRecaptchaContext | null>(null);

const RecaptchaProvider = (props: { children: React.ReactNode; siteKey: string }) => {
  const { children, siteKey } = props;
  const widgetIdRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  React.useEffect(() => {
    if (window.__recaptcha_loading) return;
    window.__recaptcha_loading = true;

    window.__recaptcha_onload = () => {
      const poll = setInterval(() => {
        if (window.grecaptcha?.ready) {
          clearInterval(poll);
          window.grecaptcha.ready(() => {
            const id = window.grecaptcha!.render('recaptcha-container', {
              sitekey: siteKey,
              callback: () => {},
              size: 'invisible',
            });
            widgetIdRef.current = id;
            setReady(true);
          });
        }
      }, 100);
    };

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=explicit&onload=__recaptcha_onload`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, [siteKey]);

  const executeRecaptcha = useCallback(async (): Promise<string> => {
    if (widgetIdRef.current == null) throw new Error('reCAPTCHA not ready');
    return window.grecaptcha!.execute(widgetIdRef.current);
  }, []);

  return (
    <RecaptchaContext.Provider value={{ executeRecaptcha }}>
      {children}
      <div id="recaptcha-container" style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 9999 }} />
    </RecaptchaContext.Provider>
  );
};

const useRecaptcha = (): IRecaptchaContext => {
  const ctx = useContext(RecaptchaContext);
  if (!ctx) throw new Error('useRecaptcha must be used within RecaptchaProvider');
  return ctx;
};

export { RecaptchaProvider, useRecaptcha };
