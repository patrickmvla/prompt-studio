"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle,
  Loader2,
  Play,
  Share2,
  ShieldCheck,
  ShieldX,
  XCircle,
} from "lucide-react";
import {
  Constraint,
  ConstraintCheck,
  TestCase,
  TestResult,
  usePromptStore,
} from "../../lib/store/prompt-store";

// Helper function to check constraints against the output
const checkConstraints = (
  output: string,
  constraints: Constraint[]
): ConstraintCheck[] => {
  return constraints.map((constraint) => {
    let passed = false;
    switch (constraint.type) {
      case "wordLimit":
        passed = output.split(/\s+/).length <= Number(constraint.value);
        break;
      case "jsonOnly":
        try {
          JSON.parse(output);
          passed = true;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          passed = false;
        }
        break;
      case "forbiddenPhrase":
        passed = !output
          .toLowerCase()
          .includes(String(constraint.value).toLowerCase());
        break;
    }
    return { constraintId: constraint.id, passed };
  });
};

const ResultCard = ({
  testCase,
  result,
}: {
  testCase: TestCase;
  result: TestResult;
}) => {
  // const constraints = usePromptStore((state) => state.constraints);

  const getStatusIcon = () => {
    if (result.status === "running")
      return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />;
    if (result.status === "completed")
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    if (result.status === "error")
      return <XCircle className="h-4 w-4 text-red-400" />;
    return null;
  };

  const passedChecks =
    result.constraintChecks?.filter((c) => c.passed).length || 0;
  const totalChecks = result.constraintChecks?.length || 0;
  const strictnessScore =
    totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 100;

  return (
    <Card className="bg-gray-900 border-gray-700/50">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <CardTitle className="text-sm font-medium text-gray-300">
            {testCase.name}
          </CardTitle>
        </div>
        {result.status === "completed" && (
          <div className="flex items-center gap-4 text-xs">
            {result.similarityScore !== undefined && (
              <span className="text-gray-400">
                Similarity:{" "}
                <span className="font-semibold text-indigo-400">
                  {(result.similarityScore * 100).toFixed(0)}%
                </span>
              </span>
            )}
            <span
              className={`flex items-center gap-1 ${
                strictnessScore === 100 ? "text-green-400" : "text-yellow-400"
              }`}
            >
              {strictnessScore === 100 ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <ShieldX className="h-4 w-4" />
              )}
              {strictnessScore.toFixed(0)}% Strict
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 border-t border-gray-700/50">
        <p className="text-gray-300 text-sm whitespace-pre-wrap font-mono">
          {result.output || "Waiting to run..."}
        </p>
      </CardContent>
    </Card>
  );
};

export const ResultsPanel = () => {
  const {
    systemRole,
    instruction,
    examples,
    testCases,
    constraints,
    results,
    isRunning,
    startTestRun,
    endTestRun,
    setResult,
    updateResultOutput,
  } = usePromptStore();

  const handleRunTests = async () => {
    startTestRun();

    for (const testCase of testCases) {
      setResult(testCase.id, { status: "running", output: "" });

      try {
        const response = await fetch("/api/run-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemRole,
            instruction,
            examples,
            testInput: testCase.input,
          }),
        });

        if (!response.ok || !response.body)
          throw new Error(`API error: ${response.statusText}`);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let finalOutput = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          finalOutput += chunk;
          updateResultOutput(testCase.id, chunk);
        }

        // --- Analysis Step ---
        const constraintChecks = checkConstraints(finalOutput, constraints);
        setResult(testCase.id, { constraintChecks });

        if (testCase.expectedOutput) {
          const similarityResponse = await fetch("/api/check-similarity", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              actualOutput: finalOutput,
              expectedOutput: testCase.expectedOutput,
            }),
          });
          if (similarityResponse.ok) {
            const { similarity } = await similarityResponse.json();
            setResult(testCase.id, { similarityScore: similarity });
          }
        }

        setResult(testCase.id, { status: "completed" });
      } catch (error) {
        console.error(`Failed to run test case ${testCase.id}:`, error);
        setResult(testCase.id, {
          output: "An error occurred.",
          status: "error",
        });
      }
    }

    endTestRun();
  };

  return (
    <div className="h-full flex flex-col p-4 gap-4 bg-[#101010]">
      <Card className="h-full flex flex-col bg-gray-900/50 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-200">
            Results
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isRunning || testCases.length === 0}
            >
              <Share2 className="mr-2 h-4 w-4" /> Share Results
            </Button>
            <Button
              size="sm"
              onClick={handleRunTests}
              disabled={isRunning || testCases.length === 0}
            >
              {isRunning ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              {isRunning ? "Running..." : "Run All Tests"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-0">
          {results.size > 0 ? (
            <ScrollArea className="h-full">
              <div className="p-4 space-y-3">
                {testCases.map((tc) => {
                  const result = results.get(tc.id);
                  return result ? (
                    <ResultCard key={tc.id} testCase={tc} result={result} />
                  ) : null;
                })}
              </div>
            </ScrollArea>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p>Results will be displayed here after a test run.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
