export type AIProvider = "anthropic" | "groq" | "gemini" | "openai" | "mistral";

export function detectProvider(key: string): AIProvider | null {
  const k = key.trim();
  if (k.startsWith("sk-ant-")) return "anthropic";
  if (k.startsWith("gsk_")) return "groq";
  if (k.startsWith("AIza")) return "gemini";
  if (k.startsWith("sk-proj-") || k.startsWith("sk-")) return "openai";
  if (k.length > 20 && !k.startsWith("sk")) return "mistral";
  return null;
}
