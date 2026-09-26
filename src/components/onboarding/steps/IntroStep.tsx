
import React from 'react';
import { Button } from "@/components/ui/button";

interface IntroStepProps {
  onNext: () => void;
}

const IntroStep: React.FC<IntroStepProps> = ({ onNext }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-lg">
          Welcome to our company! We're excited to have you join our team.
        </p>
        
        <p>
          Before accessing the main platform, please review these 3 essential company 
          documents to get familiar with our key policies, code of conduct, and 
          organizational structure.
        </p>
        
        <p>
          You will need to confirm reading and answer a couple of questions for each document.
        </p>
        
        <p className="text-[#0370a1] font-medium">
          This is a demonstration of our mandatory pre-onboarding process.
        </p>
        
        <p className="text-sm text-gray-500 italic">
          Note: This demo will automatically open on your first visit. After completion, 
          it won't show automatically on subsequent visits to this page.
        </p>
      </div>
      
      <div className="flex justify-center pt-6">
        <Button 
          onClick={onNext}
          className="bg-[#0ea5e9] hover:bg-[#028ac7] text-[#ffffff] px-8 py-2 rounded-md"
        >
          Start Pre-Onboarding
        </Button>
      </div>
    </div>
  );
};

export default IntroStep;
