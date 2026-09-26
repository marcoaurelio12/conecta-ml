import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import IntroStep from './steps/IntroStep';
import CompanyPoliciesStep from './steps/CompanyPoliciesStep';
import CodeOfConductStep from './steps/CodeOfConductStep';
import OrganizationalManualStep from './steps/OrganizationalManualStep';
import CompletionStep from './steps/CompletionStep';

export type PreOnboardingStep = 
  | 'intro' 
  | 'company-policies' 
  | 'code-of-conduct' 
  | 'organizational-manual' 
  | 'completion';

interface PreOnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TOTAL_STEPS = 5;

const PreOnboardingModal: React.FC<PreOnboardingModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [currentStep, setCurrentStep] = useState<PreOnboardingStep>('intro');
  const [stepProgress, setStepProgress] = useState({
    'intro': { completed: false },
    'company-policies': { completed: false, readConfirmed: false },
    'code-of-conduct': { completed: false, readConfirmed: false },
    'organizational-manual': { completed: false, readConfirmed: false },
    'completion': { completed: false },
  });

  const getStepNumber = (step: PreOnboardingStep): number => {
    const stepMap: Record<PreOnboardingStep, number> = {
      'intro': 1,
      'company-policies': 2,
      'code-of-conduct': 3,
      'organizational-manual': 4,
      'completion': 5
    };
    return stepMap[step];
  };

  const progressPercentage = ((getStepNumber(currentStep) - 1) / (TOTAL_STEPS - 1)) * 100;

  const handleNextStep = (next: PreOnboardingStep) => {
    setStepProgress(prev => ({
      ...prev,
      [currentStep]: { ...prev[currentStep], completed: true }
    }));
    setCurrentStep(next);
  };

  const handleConfirmReading = (step: PreOnboardingStep) => {
    setStepProgress(prev => ({
      ...prev,
      [step]: { ...prev[step], readConfirmed: true }
    }));
  };

  const handleComplete = () => {
    setStepProgress(prev => ({
      ...prev,
      'completion': { completed: true }
    }));
    
    // Set the localStorage flag to indicate pre-onboarding is completed
    localStorage.setItem('preOnboardingDemoCompleted', 'true');
    
    // Close the modal
    onOpenChange(false);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpenState) => {
        // Only allow the modal to close through the completion button
        // If trying to close (newOpenState is false) and we're not explicitly closing it through handleComplete,
        // prevent the closing action by doing nothing
        if (newOpenState === true) {
          onOpenChange(true);
        }
        // Otherwise, don't call onOpenChange, which prevents the modal from closing
      }}
      modal={true}
    >
      <DialogContent 
        className={cn(
          "max-w-[90vw] w-[900px] max-h-[90vh] h-[80vh] p-0",
          "flex flex-col bg-[#f0faff] border-[#7dd5fc]"
        )}
        // Remove the close button by setting hideCloseButton to true
        hideCloseButton={true}
        // Prevent closing when clicking outside
        onPointerDownOutside={(e) => e.preventDefault()}
        // Prevent closing on escape key press
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="p-6 pb-4 border-b border-[#bae8fd]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#0370a1]">
              {currentStep === 'intro' && "Welcome to MyApp! Your Pre-Onboarding Starts Now"}
              {currentStep === 'company-policies' && "1/3: Company Policies"}
              {currentStep === 'code-of-conduct' && "2/3: Code of Conduct"}
              {currentStep === 'organizational-manual' && "3/3: Organizational Manual"}
              {currentStep === 'completion' && "Pre-Onboarding Complete!"}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-[#028ac7] mb-2">
              <span>Step {getStepNumber(currentStep)} of {TOTAL_STEPS}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-[#e0f5fe]" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 'intro' && (
            <IntroStep onNext={() => handleNextStep('company-policies')} />
          )}
          
          {currentStep === 'company-policies' && (
            <CompanyPoliciesStep 
              readConfirmed={stepProgress['company-policies'].readConfirmed}
              onConfirmReading={() => handleConfirmReading('company-policies')}
              onNext={() => handleNextStep('code-of-conduct')}
            />
          )}
          
          {currentStep === 'code-of-conduct' && (
            <CodeOfConductStep 
              readConfirmed={stepProgress['code-of-conduct'].readConfirmed}
              onConfirmReading={() => handleConfirmReading('code-of-conduct')}
              onNext={() => handleNextStep('organizational-manual')}
            />
          )}
          
          {currentStep === 'organizational-manual' && (
            <OrganizationalManualStep 
              readConfirmed={stepProgress['organizational-manual'].readConfirmed}
              onConfirmReading={() => handleConfirmReading('organizational-manual')}
              onNext={() => handleNextStep('completion')}
            />
          )}
          
          {currentStep === 'completion' && (
            <CompletionStep onComplete={handleComplete} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreOnboardingModal;
