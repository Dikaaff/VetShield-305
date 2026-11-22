import { createHash } from "node:crypto";

const CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

export function stripControlChars(text: string): string {
  return text.replace(CONTROL_CHARS, "").replace(/\r\n/g, "\n");
}

export function normalizeInput(text: string): string {
  return stripControlChars(text).replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

export function truncateInput(text: string, max = 4000): { text: string; truncated: boolean } {
  if (text.length <= max) return { text, truncated: false };
  return { text: text.slice(0, max), truncated: true };
}

/** Remove anything that could identify a person before we persist an excerpt. */
export function redact(text: string): { text: string; redacted: boolean } {
  let redacted = false;
  const note = () => {
    redacted = true;
  };

  let output = text
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, () => {
      note();
      return "[email]";
    })
    .replace(/\+?\d[\d\s().-]{7,}\d/g, (match) => {
      note();
      return "[nomor]";
    })
    .replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, () => {
      note();
      return "[kartu]";
    })
    .replace(/https?:\/\/\S+/g, (match) => {
      const base = match.split("?")[0] ?? match;
      if (base !== match) note();
      return base;
    });

  output = output.slice(0, 160);
  return { text: output, redacted };
}

export function hashText(text: string): string {
  const salt = process.env.PII_HASH_SALT ?? "vetshield-dev-salt";
  return createHash("sha256").update(`${salt}:${text}`).digest("hex");
}
