"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, Upload, X } from "lucide-react";
import { usePromptStore, TestCase } from "@/lib/store/prompt-store";
import { AddTestCaseDialog } from "@/components/studio/add-test-case-dialog";

const TestCaseRow = ({ testCase }: { testCase: TestCase }) => {
  const removeTestCase = usePromptStore((state) => state.removeTestCase);
  return (
    <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-200">
          {testCase.name}
        </span>
        <p className="text-xs text-gray-400 truncate max-w-xs">
          {testCase.input}
        </p>
      </div>
      <button
        onClick={() => removeTestCase(testCase.id)}
        className="rounded-full hover:bg-gray-700 p-1"
      >
        <X className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  );
};

export const TestCasesPanel = () => {
  const testCases = usePromptStore((state) => state.testCases);

  return (
    <div className="h-full flex flex-col p-4 gap-4 bg-[#101010] border-b border-gray-800">
      <Card className="h-full flex flex-col bg-gray-900/50 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-200">
            Test Cases ({testCases.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload CSV
            </Button>
            <AddTestCaseDialog>
              <Button variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Test Case
              </Button>
            </AddTestCaseDialog>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-0">
          {testCases.length > 0 ? (
            <ScrollArea className="h-full">
              <div className="p-4 space-y-3">
                {testCases.map((tc) => (
                  <TestCaseRow key={tc.id} testCase={tc} />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p>No test cases defined.</p>
                <p className="text-sm">Add your first test case to begin.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
