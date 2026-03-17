import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const analyzingSteps = [
  "Analisando seu posicionamento...",
  "Cruzando percepção, preço e diferenciação...",
  "Montando seu diagnóstico...",
];

interface QuizAnalyzingProps {
  onComplete: () => void;
}

const QuizAnalyzing = ({ onComplete }: QuizAnalyzingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDuration = 1400;
    const progressInterval = 30;
    const totalDuration = stepDuration * analyzingSteps.length;
    const increment = 100 / (totalDuration / progressInterval);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, progressInterval);

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= analyzingSteps.length - 1) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return prev;
        }
        return prev + 1;
      });
    }, stepDuration);

    return () => {
      clearInterval(timer);
      clearInterval(progressTimer);
    };
  }, [onComplete]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        {/* Spinner */}
        <div className="relative mb-10 flex justify-center">
          <div className="h-20 w-20 rounded-full border-4 border-primary/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 rounded-full border-4 border-primary border-t-transparent animate-spin-slow" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Steps */}
        <div className="mb-8 space-y-3">
          {analyzingSteps.map((step, index) => (
            <p
              key={step}
              className={cn(
                "text-base font-medium transition-all duration-500 sm:text-lg",
                index === currentStep
                  ? "text-secondary opacity-100 translate-y-0"
                  : index < currentStep
                  ? "text-muted-foreground/40 opacity-100 -translate-y-1"
                  : "text-muted-foreground opacity-0 translate-y-2"
              )}
            >
              {index < currentStep && (
                <span className="mr-1.5 text-primary">✓</span>
              )}
              {step}
            </p>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mx-auto h-1.5 w-48 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizAnalyzing;
