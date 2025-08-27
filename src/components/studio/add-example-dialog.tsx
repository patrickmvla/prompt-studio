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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { usePromptStore } from "../../lib/store/prompt-store";

export const AddExampleDialog = ({ children }: { children: React.ReactNode }) => {
  const addExample = usePromptStore((state) => state.addExample);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (!input || !output) {
      // Add more robust validation/toast later
      return;
    }
    
    addExample({ input, output });
    
    // Reset state and close dialog
    setInput('');
    setOutput('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] bg-gray-900 border-gray-800 text-gray-200">
        <DialogHeader>
          <DialogTitle>Add New Example</DialogTitle>
          <DialogDescription>
            Provide an example input and the desired output. This helps guide the model.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="example-input">Input</Label>
            <Textarea 
              id="example-input" 
              placeholder="Example user input..." 
              className="bg-gray-800 border-gray-700 min-h-[100px]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="example-output">Output</Label>
            <Textarea 
              id="example-output" 
              placeholder="The ideal model output..." 
              className="bg-gray-800 border-gray-700 min-h-[100px]"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Add Example</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
