import { useState } from 'react';

export function useClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  async function copyText(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }

  return { copyText, isCopied };
}
