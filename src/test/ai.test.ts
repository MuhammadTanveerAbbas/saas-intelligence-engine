import { describe, it, expect } from "vitest";
import { detectProvider } from "@/lib/ai";

describe("detectProvider", () => {
  it("detects Anthropic keys", () => {
    expect(detectProvider("sk-ant-api03-abc")).toBe("anthropic");
  });

  it("detects Groq keys", () => {
    expect(detectProvider("gsk_test123")).toBe("groq");
  });

  it("detects Gemini keys", () => {
    expect(detectProvider("AIzaSyDexample")).toBe("gemini");
  });

  it("detects OpenAI keys", () => {
    expect(detectProvider("sk-proj-abc")).toBe("openai");
    expect(detectProvider("sk-abc")).toBe("openai");
  });

  it("returns null for empty or unrecognized keys", () => {
    expect(detectProvider("")).toBe(null);
    expect(detectProvider("short")).toBe(null);
  });
});
