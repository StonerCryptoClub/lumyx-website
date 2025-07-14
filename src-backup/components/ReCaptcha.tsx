import { useEffect, useCallback } from 'react';
import Script from 'next/script';

interface ReCaptchaProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

declare global {
  interface Window {
    grecaptcha: any;
    onReCaptchaLoad: () => void;
  }
}

export default function ReCaptcha({ onVerify, onError, onExpire }: ReCaptchaProps) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const handleLoad = useCallback(() => {
    if (!window.grecaptcha) {
      console.error('reCAPTCHA not loaded');
      return;
    }

    window.grecaptcha.ready(() => {
      window.grecaptcha.render('recaptcha-container', {
        sitekey: siteKey,
        callback: onVerify,
        'error-callback': onError,
        'expired-callback': onExpire,
      });
    });
  }, [siteKey, onVerify, onError, onExpire]);

  useEffect(() => {
    window.onReCaptchaLoad = handleLoad;
    return () => {
      window.onReCaptchaLoad = () => {};
    };
  }, [handleLoad]);

  if (!siteKey) {
    console.error('reCAPTCHA site key not found');
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?onload=onReCaptchaLoad&render=explicit`}
        strategy="lazyOnload"
      />
      <div id="recaptcha-container" className="mt-4" />
    </>
  );
} 