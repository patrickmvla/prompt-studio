import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, X } from "lucide-react";
import { usePromptStore, Constraint, Example } from "@/lib/store/prompt-store";
import { AddConstraintDialog } from "@/components/studio/add-constraint-dialog";
import { AddExampleDialog } from "@/components/studio/add-example-dialog";
import { PromptAnalysisBar } from "@/components/studio/prompt-analysis-bar";

const ConstraintPill = ({ constraint }: { constraint: Constraint }) => {
  const removeConstraint = usePromptStore((state) => state.removeConstraint);

  const getLabel = () => {
    switch (constraint.type) {
      case "wordLimit":
        return `Max ${constraint.value} words`;
      case "jsonOnly":
        return `JSON Output`;
      case "forbiddenPhrase":
        return `Forbid: "${constraint.value}"`;
      default:
        return "Unknown Constraint";
    }
  };

  return (
    <Badge
      variant="secondary"
      className="py-1 px-2 text-sm flex items-center justify-between"
    >
      <span>{getLabel()}</span>
      <button
        onClick={() => removeConstraint(constraint.id)}
        className="ml-2 rounded-full hover:bg-gray-600 p-0.5"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
};

const ExampleCard = ({ example }: { example: Example }) => {
  const removeExample = usePromptStore((state) => state.removeExample);
  return (
    <Card className="bg-gray-900 border-gray-700/50">
      <CardHeader className="p-4 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-sm font-medium text-gray-400">
            Input
          </CardTitle>
          <CardDescription className="text-gray-300 text-sm pt-1">
            {example.input}
          </CardDescription>
        </div>
        <button
          onClick={() => removeExample(example.id)}
          className="rounded-full hover:bg-gray-700 p-1"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </CardHeader>
      <CardContent className="p-4 border-t border-gray-700/50">
        <h4 className="text-sm font-medium text-gray-400">Output</h4>
        <p className="text-gray-300 text-sm pt-1">{example.output}</p>
      </CardContent>
    </Card>
  );
};

export const PromptEditorPanel = () => {
  const {
    systemRole,
    setSystemRole,
    instruction,
    setInstruction,
    constraints,
    examples,
  } = usePromptStore();

  return (
    <div className="h-full flex flex-col bg-[#101010] border-r border-gray-800">
      <div className="flex-grow flex flex-col gap-4 overflow-y-auto p-4 pr-2">
        {/* System Role Section */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-200">
              System Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., You are a helpful assistant that provides concise answers."
              className="bg-gray-900 border-gray-700 focus:ring-indigo-500"
              value={systemRole}
              onChange={(e) => setSystemRole(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Instruction Section */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-200">
              Instruction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., Summarize the following text..."
              className="bg-gray-900 border-gray-700 focus:ring-indigo-500 min-h-[150px]"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Constraints Section */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-200">
              Constraints
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {constraints.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {constraints.map((c) => (
                  <ConstraintPill key={c.id} constraint={c} />
                ))}
              </div>
            ) : (
              <div className="p-4 border border-dashed border-gray-700 rounded-lg text-center text-gray-500">
                <p>No constraints added.</p>
              </div>
            )}
            <AddConstraintDialog>
              <Button variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Constraint
              </Button>
            </AddConstraintDialog>
          </CardContent>
        </Card>

        {/* Examples Section */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-200">
              Examples
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {examples.length > 0 ? (
              <div className="flex flex-col gap-3">
                {examples.map((e) => (
                  <ExampleCard key={e.id} example={e} />
                ))}
              </div>
            ) : (
              <div className="p-4 border border-dashed border-gray-700 rounded-lg text-center text-gray-500">
                <p>No examples added.</p>
              </div>
            )}
            <AddExampleDialog>
              <Button variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Example
              </Button>
            </AddExampleDialog>
          </CardContent>
        </Card>
      </div>
      <PromptAnalysisBar />
    </div>
  );
};
