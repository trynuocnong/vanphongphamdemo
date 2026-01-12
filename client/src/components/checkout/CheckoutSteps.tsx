import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
    number: number;
    title: string;
    description: string;
}

interface CheckoutStepsProps {
    currentStep: number;
    onStepClick?: (step: number) => void;
}

const steps: Step[] = [
    { number: 1, title: "Shipping", description: "Delivery information" },
    { number: 2, title: "Payment", description: "Payment method" },
    { number: 3, title: "Review", description: "Confirm order" },
];

export function CheckoutSteps({ currentStep, onStepClick }: CheckoutStepsProps) {
    return (
        <div className="w-full py-8">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
                {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center flex-1">
                        {/* Step Circle */}
                        <div className="flex flex-col items-center flex-1">
                            <button
                                onClick={() => onStepClick && currentStep > step.number && onStepClick(step.number)}
                                disabled={currentStep < step.number}
                                className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all",
                                    currentStep > step.number && "bg-green-600 text-white cursor-pointer hover:bg-green-700",
                                    currentStep === step.number && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                                    currentStep < step.number && "bg-muted text-muted-foreground cursor-not-allowed"
                                )}
                            >
                                {currentStep > step.number ? (
                                    <Check className="w-6 h-6" />
                                ) : (
                                    step.number
                                )}
                            </button>
                            <div className="mt-2 text-center">
                                <p className={cn(
                                    "text-sm font-medium",
                                    currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                                )}>
                                    {step.title}
                                </p>
                                <p className="text-xs text-muted-foreground hidden sm:block">
                                    {step.description}
                                </p>
                            </div>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div className={cn(
                                "h-0.5 flex-1 mx-2 transition-colors",
                                currentStep > step.number ? "bg-green-600" : "bg-muted"
                            )} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
