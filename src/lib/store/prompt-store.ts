import { create } from "zustand";

export interface Constraint {
  id: string;
  type: "wordLimit" | "jsonOnly" | "forbiddenPhrase";
  value: string | number;
}

export interface Example {
  id: string;
  input: string;
  output: string;
}

export interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput?: string;
}

export interface ConstraintCheck {
  constraintId: string;
  passed: boolean;
}

export interface TestResult {
  output: string;
  status: "pending" | "running" | "completed" | "error";
  constraintChecks?: ConstraintCheck[];
  similarityScore?: number;
}

type SaveStatus = "unsaved" | "saving" | "saved";

export interface HistorySnapshot {
  id: string;
  timestamp: Date;
  systemRole: string;
  instruction: string;
  constraints: Constraint[];
  examples: Example[];
  results: Map<string, TestResult>;
}

interface PromptState {
  // Data
  promptId: string | null;
  systemRole: string;
  instruction: string;
  constraints: Constraint[];
  examples: Example[];
  testCases: TestCase[];
  results: Map<string, TestResult>;
  history: HistorySnapshot[];

  // Status
  isRunning: boolean;
  saveStatus: SaveStatus;
  tokenCount: number;

  // Actions
  setSystemRole: (role: string) => void;
  setInstruction: (instruction: string) => void;
  addConstraint: (constraint: Omit<Constraint, "id">) => void;
  removeConstraint: (id: string) => void;
  addExample: (example: Omit<Example, "id">) => void;
  removeExample: (id: string) => void;
  addTestCase: (testCase: Omit<TestCase, "id">) => void;
  removeTestCase: (id: string) => void;

  startTestRun: () => void;
  endTestRun: () => void;
  setResult: (testCaseId: string, result: Partial<TestResult>) => void;
  updateResultOutput: (testCaseId: string, chunk: string) => void;

  savePrompt: () => Promise<void>;
  loadPrompt: (id: string) => Promise<void>;
  resetPrompt: () => void;

  updateTokenCount: () => Promise<void>;
  addHistorySnapshot: () => void;
}

const initialState = {
  promptId: null,
  systemRole: "",
  instruction: "",
  constraints: [],
  examples: [],
  testCases: [],
  results: new Map(),
  history: [],
  isRunning: false,
  saveStatus: "saved" as SaveStatus,
  tokenCount: 0,
};

export const usePromptStore = create<PromptState>((set, get) => ({
  ...initialState,

  setSystemRole: (role) => set({ systemRole: role, saveStatus: "unsaved" }),
  setInstruction: (instruction) => set({ instruction, saveStatus: "unsaved" }),

  addConstraint: (constraint) =>
    set((state) => ({
      constraints: [
        ...state.constraints,
        { ...constraint, id: crypto.randomUUID() },
      ],
      saveStatus: "unsaved",
    })),

  removeConstraint: (id) =>
    set((state) => ({
      constraints: state.constraints.filter((c) => c.id !== id),
      saveStatus: "unsaved",
    })),

  addExample: (example) =>
    set((state) => ({
      examples: [...state.examples, { ...example, id: crypto.randomUUID() }],
      saveStatus: "unsaved",
    })),

  removeExample: (id) =>
    set((state) => ({
      examples: state.examples.filter((e) => e.id !== id),
      saveStatus: "unsaved",
    })),

  addTestCase: (testCase) =>
    set((state) => ({
      testCases: [...state.testCases, { ...testCase, id: crypto.randomUUID() }],
      saveStatus: "unsaved",
    })),

  removeTestCase: (id) =>
    set((state) => ({
      testCases: state.testCases.filter((tc) => tc.id !== id),
      saveStatus: "unsaved",
    })),

  startTestRun: () => {
    const { testCases } = get();
    const initialResults = new Map<string, TestResult>();
    testCases.forEach((tc) => {
      initialResults.set(tc.id, { output: "", status: "pending" });
    });
    set({ isRunning: true, results: initialResults });
  },

  endTestRun: () => {
    get().addHistorySnapshot();
    set({ isRunning: false });
  },

  setResult: (testCaseId, resultUpdate) =>
    set((state) => {
      const newResults = new Map(state.results);
      const currentResult = newResults.get(testCaseId) || {
        output: "",
        status: "pending",
      };
      newResults.set(testCaseId, { ...currentResult, ...resultUpdate });
      return { results: newResults };
    }),

  updateResultOutput: (testCaseId, chunk) =>
    set((state) => {
      const newResults = new Map(state.results);
      const currentResult = newResults.get(testCaseId);
      if (currentResult) {
        newResults.set(testCaseId, {
          ...currentResult,
          output: currentResult.output + chunk,
        });
      }
      return { results: newResults };
    }),

  savePrompt: async () => {
    const {
      promptId,
      systemRole,
      instruction,
      constraints,
      examples,
      testCases,
    } = get();
    set({ saveStatus: "saving" });

    const promptData = {
      systemRole,
      instruction,
      constraints,
      examples,
      testCases,
    };

    try {
      let savedPrompt;
      if (promptId) {
        const response = await fetch(`/api/prompts?id=${promptId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(promptData),
        });
        savedPrompt = await response.json();
      } else {
        const response = await fetch("/api/prompts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(promptData),
        });
        savedPrompt = await response.json();
      }

      if (savedPrompt.error) throw new Error(savedPrompt.error);

      set({ promptId: savedPrompt.id, saveStatus: "saved" });
    } catch (error) {
      console.error("Failed to save prompt:", error);
      set({ saveStatus: "unsaved" });
    }
  },

  loadPrompt: async (id: string) => {
    try {
      const response = await fetch(`/api/prompts/${id}`);
      if (!response.ok) throw new Error("Prompt not found");

      const data = await response.json();

      set({
        ...initialState,
        promptId: data.id,
        systemRole: data.systemRole || "",
        instruction: data.instruction || "",
        constraints: data.constraints || [],
        examples: data.examples || [],
        testCases: data.testCases || [],
        saveStatus: "saved",
      });
      get().updateTokenCount();
    } catch (error) {
      console.error("Failed to load prompt:", error);
    }
  },

  resetPrompt: () => set(initialState),

  updateTokenCount: async () => {
    const { systemRole, instruction } = get();
    const fullText = `${systemRole} ${instruction}`;

    if (fullText.trim() === "") {
      set({ tokenCount: 0 });
      return;
    }

    try {
      const response = await fetch("/api/tokenize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fullText }),
      });
      if (response.ok) {
        const { tokenCount } = await response.json();
        set({ tokenCount });
      }
    } catch (error) {
      console.error("Failed to update token count:", error);
    }
  },

  addHistorySnapshot: () => {
    const { systemRole, instruction, constraints, examples, results } = get();
    const newSnapshot: HistorySnapshot = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      systemRole,
      instruction,
      constraints,
      examples,
      results,
    };
    set((state) => ({ history: [newSnapshot, ...state.history] }));
  },
}));
