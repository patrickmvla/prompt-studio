"use client";

import { Save, PlusCircle, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePromptStore } from "../../lib/store/prompt-store";
import { useEffect } from "react";
import { HistoryPanel } from "./history-panel";
import YAML from "yaml"; // You'll need to run: npm install yaml

const SaveButton = () => {
  const saveStatus = usePromptStore((state) => state.saveStatus);
  const savePrompt = usePromptStore((state) => state.savePrompt);

  const getButtonContent = () => {
    switch (saveStatus) {
      case "saving":
        return (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
          </>
        );
      case "saved":
        return "Saved";
      case "unsaved":
        return (
          <>
            <Save className="mr-2 h-4 w-4" /> Save
          </>
        );
    }
  };

  return (
    <Button
      size="sm"
      onClick={savePrompt}
      disabled={saveStatus === "saving" || saveStatus === "saved"}
    >
      {getButtonContent()}
    </Button>
  );
};

const ExportButton = () => {
  const { systemRole, instruction, constraints, examples, testCases } =
    usePromptStore();

  const handleExport = (format: "json" | "yaml") => {
    const promptData = {
      systemRole,
      instruction,
      constraints,
      examples,
      testCases,
    };
    const mimeType = format === "json" ? "application/json" : "text/yaml";
    const fileExtension = format;

    const content =
      format === "json"
        ? JSON.stringify(promptData, null, 2)
        : YAML.stringify(promptData);

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prompt-studio-export.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-900 border-gray-800 text-gray-200">
        <DropdownMenuItem onClick={() => handleExport("json")}>
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("yaml")}>
          Export as YAML
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const StudioHeader = () => {
  const resetPrompt = usePromptStore((state) => state.resetPrompt);
  const savePrompt = usePromptStore((state) => state.savePrompt);
  const saveStatus = usePromptStore((state) => state.saveStatus);

  // Auto-save on CMD+S / CTRL+S
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "s") {
        event.preventDefault();
        if (saveStatus === "unsaved") {
          savePrompt();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [savePrompt, saveStatus]);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-800 bg-[#101010] px-4">
      <div>{/* We can add breadcrumbs or project title here later */}</div>
      <div className="flex items-center gap-2">
        <HistoryPanel />
        <ExportButton />
        <Button variant="outline" size="sm" onClick={resetPrompt}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Prompt
        </Button>
        <SaveButton />
      </div>
    </header>
  );
};
