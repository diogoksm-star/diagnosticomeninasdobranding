import { useEffect, useState } from "react";

const analyzingSteps = [
  "Analisando seu posicionamento…",
  "Cruzando percepção, preço e diferenciação…",
  "Seu diagnóstico está pronto",
];

interface QuizAnalyzingProps {
  onComplete: () => void;
}

const QuizAnalyzing = ({ onComplete }: QuizAnalyzingProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const stepDuration = 1200;

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= analyzingSteps.length - 1) {
          clearInterval(timer);
          setTimeout(onComplete, 600);
          return prev;
        }
        return prev + 1;
      });
    }, stepDuration);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="mx-auto h-24 w-24 rounded-full border-4 border-primary/20">
            <div className="absolute inset-0 animate-analyzing rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>

        <div className="space-y-3">
          {analyzingSteps.map((step, index) => (
            <p
              key={step}
              className={`text-lg font-medium transition-all duration-500 sm:text-xl ${
                index === currentStep
                  ? "text-primary opacity-100"
                  : index < currentStep
                  ? "text-muted-foreground opacity-50"
                  : "text-muted-foreground opacity-0"
              }`}
            >
              {step}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizAnalyzing;
