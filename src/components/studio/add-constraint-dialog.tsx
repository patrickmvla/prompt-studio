"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePromptStore, Constraint } from "@/lib/store/prompt-store";

export const AddConstraintDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const addConstraint = usePromptStore((state) => state.addConstraint);
  const [type, setType] = useState<Constraint["type"] | "">("");
  const [value, setValue] = useState<string | number>("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (!type || value === "") {
      return;
    }

    addConstraint({ type, value });

    setType("");
    setValue("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800 text-gray-200">
        <DialogHeader>
          <DialogTitle>Add New Constraint</DialogTitle>
          <DialogDescription>
            Select a constraint type and provide a value. This will be used to
            test the prompts adherence.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="constraint-type" className="text-right">
              Type
            </Label>
            <Select
              onValueChange={(v) => setType(v as Constraint["type"])}
              value={type}
            >
              <SelectTrigger
                id="constraint-type"
                className="col-span-3 bg-gray-800 border-gray-700"
              >
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                <SelectItem value="wordLimit">Word Limit</SelectItem>
                <SelectItem value="jsonOnly">Respond in JSON</SelectItem>
                <SelectItem value="forbiddenPhrase">
                  Forbidden Phrase
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="constraint-value" className="text-right">
              Value
            </Label>
            <Input
              id="constraint-value"
              placeholder="e.g., 50 or 'error'"
              className="col-span-3 bg-gray-800 border-gray-700"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Add Constraint
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
