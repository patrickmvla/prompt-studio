"use client";

import { useEffect } from "react";
import { usePromptStore } from "../../lib/store/prompt-store";
import { Coins, ToyBrick } from "lucide-react";

// A rough cost estimate per 1 million tokens for Llama 3 70B on Groq
const COST_PER_MILLION_TOKENS = 0.59;

export const PromptAnalysisBar = () => {
  const { systemRole, instruction, testCases, tokenCount, updateTokenCount } =
    usePromptStore();

  // Debounce the token count update to avoid excessive API calls while typing
  useEffect(() => {
    const handler = setTimeout(() => {
      updateTokenCount();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [systemRole, instruction, updateTokenCount]);

  const estimatedCost =
    ((tokenCount * testCases.length) / 1_000_000) * COST_PER_MILLION_TOKENS;

  return (
    <div className="flex h-12 items-center justify-between border-t border-gray-800 bg-[#101010] px-4 text-xs text-gray-400">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <ToyBrick className="h-4 w-4" />
          <span>
            Prompt Tokens:{" "}
            <span className="font-semibold text-gray-200">{tokenCount}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4" />
          <span>
            Est. Run Cost:{" "}
            <span className="font-semibold text-gray-200">
              ${estimatedCost.toFixed(6)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
