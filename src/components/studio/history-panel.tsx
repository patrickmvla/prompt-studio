"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from "lucide-react";
import { usePromptStore, HistorySnapshot } from "@/lib/store/prompt-store";

const HistoryItem = ({ snapshot }: { snapshot: HistorySnapshot }) => {
  let passedConstraints = 0;
  let totalConstraints = 0;

  snapshot.results.forEach((result) => {
    if (result.constraintChecks) {
      passedConstraints += result.constraintChecks.filter(
        (c) => c.passed
      ).length;
      totalConstraints += result.constraintChecks.length;
    }
  });

  const overallStrictness =
    totalConstraints > 0 ? (passedConstraints / totalConstraints) * 100 : 100;

  return (
    <div className="p-3 rounded-lg bg-gray-900 hover:bg-gray-800/60 cursor-pointer transition-colors">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-200">
          {snapshot.timestamp.toLocaleTimeString()}
        </span>
        <span
          className={`font-semibold ${
            overallStrictness === 100 ? "text-green-400" : "text-yellow-400"
          }`}
        >
          {overallStrictness.toFixed(0)}% Strict
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-1 truncate">
        {snapshot.instruction || "No instruction provided."}
      </p>
    </div>
  );
};

export const HistoryPanel = () => {
  const history = usePromptStore((state) => state.history);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="mr-2 h-4 w-4" />
          History ({history.length})
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] bg-gray-900 border-gray-800 text-gray-200">
        <SheetHeader>
          <SheetTitle>Run History</SheetTitle>
          <SheetDescription>
            A timeline of all your test runs for this session. Click an item to
            view details or restore.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100%-80px)] mt-4">
          <div className="space-y-3 pr-4">
            {history.length > 0 ? (
              history.map((snapshot) => (
                <HistoryItem key={snapshot.id} snapshot={snapshot} />
              ))
            ) : (
              <div className="flex h-full items-center justify-center text-center text-gray-500 py-16">
                <p>Your test run history will appear here.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
