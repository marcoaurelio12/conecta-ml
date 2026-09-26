
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';

interface CompletionStepProps {
  onComplete: () => void;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ onComplete }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <div className="text-center mb-4">
        <CheckCircle className="w-16 h-16 text-[#0ea5e9] mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-[#0370a1] mb-4">
          Congratulations!
        </h2>
        <p className="text-lg mb-2">
          You have successfully completed the essential pre-onboarding documents.
        </p>
        <p className="text-base text-gray-600">
          In a real scenario, your responses would now be reviewed by HR, and you would be 
          granted full access to the main platform within 24 hours.
        </p>
      </div>
      
      <div className="pt-8">
        <Button 
          onClick={onComplete}
          className="bg-[#0ea5e9] hover:bg-[#028ac7] text-white px-8 py-2 rounded-md text-lg"
        >
          Proceed to Main Platform (Demo)
        </Button>
      </div>
    </div>
  );
};

export default CompletionStep;
