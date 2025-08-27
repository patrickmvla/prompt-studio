"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { StudioHeader } from "@/components/studio/studio-header";
import { PromptEditorPanel } from "@/components/studio/prompt-editor-panel";
import { TestCasesPanel } from "@/components/studio/test-cases-panel";
import { ResultsPanel } from "@/components/studio/results-panel";

const StudioPage = () => {
  return (
    <div className="h-screen w-screen bg-[#0A0A0A] text-gray-200 flex flex-col">
      <StudioHeader />
      <div className="flex-grow">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={40} minSize={20}>
            <PromptEditorPanel />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60} minSize={30}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={65} minSize={25}>
                <TestCasesPanel />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={35} minSize={15}>
                <ResultsPanel />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default StudioPage;
