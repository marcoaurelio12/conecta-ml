
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface CompanyPoliciesStepProps {
  readConfirmed: boolean;
  onConfirmReading: () => void;
  onNext: () => void;
}

const CompanyPoliciesStep: React.FC<CompanyPoliciesStepProps> = ({ 
  readConfirmed, 
  onConfirmReading, 
  onNext 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate submission delay
    setTimeout(() => {
      onNext();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-md border border-[#bae8fd] h-60 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Company Policies</h3>
        <p className="mb-3">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies aliquam, quam nisl ultricies nisl, vitae ultricies nisl nisl vitae nisl.
        </p>
        <p className="mb-3">
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Proin eget tortor risus. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus.
        </p>
        <p className="mb-3">
          Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.
        </p>
        <p>
          Curabitur aliquet quam id dui posuere blandit. Curabitur aliquet quam id dui posuere blandit. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.
        </p>
      </div>
      
      <div className="mt-6">
        <Button 
          onClick={onConfirmReading} 
          disabled={readConfirmed}
          variant={readConfirmed ? "secondary" : "default"}
          className={readConfirmed 
            ? "bg-[#e0f5fe] text-[#0370a1] border border-[#7dd5fc] w-full" 
            : "bg-[#0ea5e9] hover:bg-[#028ac7] text-white w-full"
          }
        >
          {readConfirmed ? "Reading Confirmed!" : "I Have Read and Understood This Document"}
        </Button>
      </div>
      
      {readConfirmed && (
        <div className="border-t border-[#bae8fd] pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Comprehension Questions</h3>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="question1" className="text-base font-medium">
                Q1: What is the primary purpose of our attendance policy?
              </Label>
              <RadioGroup defaultValue="option1" id="question1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option1" id="option1" />
                  <Label htmlFor="option1">To track employee hours</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option2" id="option2" />
                  <Label htmlFor="option2">To ensure workplace efficiency</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option3" id="option3" />
                  <Label htmlFor="option3">To comply with labor laws</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="question2" className="text-base font-medium">
                Q2: Explain how you would request time off according to our policies:
              </Label>
              <Textarea 
                id="question2" 
                placeholder="Type your answer here..." 
                rows={3}
              />
            </div>
          </div>
          
          <div className="mt-8">
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#0ea5e9] hover:bg-[#028ac7] text-white px-8 py-2 rounded-md w-full"
            >
              {isSubmitting ? "Submitting..." : "Submit Answers and Go to Document 2"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyPoliciesStep;
