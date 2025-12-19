import { useState } from "react";
import { cn } from "@/lib/utils";
import { QuizQuestion as QuizQuestionType } from "./QuizData";
import QuizProgress from "./QuizProgress";

interface QuizQuestionProps {
  question: QuizQuestionType;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (points: number) => void;
}

const QuizQuestion = ({
  question,
  currentIndex,
  totalQuestions,
  onAnswer,
}: QuizQuestionProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSelect = (index: number, points: number) => {
    if (isAnimating) return;
    
    setSelectedIndex(index);
    setIsAnimating(true);

    setTimeout(() => {
      onAnswer(points);
      setSelectedIndex(null);
      setIsAnimating(false);
    }, 400);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8">
          <QuizProgress current={currentIndex + 1} total={totalQuestions} />
        </div>

        <div className="animate-fade-in">
          <h2 className="mb-8 text-center text-xl font-semibold text-secondary sm:text-2xl md:text-3xl">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={option.label}
                onClick={() => handleSelect(index, option.points)}
                disabled={isAnimating}
                className={cn(
                  "group w-full rounded-2xl border-2 p-4 text-left transition-all duration-300",
                  "hover:border-primary hover:bg-primary/5",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  selectedIndex === index
                    ? "border-primary bg-primary/10 scale-[0.98]"
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all",
                      selectedIndex === index
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-primary/30 text-primary group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
                    )}
                  >
                    {option.label}
                  </span>
                  <span
                    className={cn(
                      "text-base font-medium transition-colors sm:text-lg",
                      selectedIndex === index
                        ? "text-primary"
                        : "text-foreground"
                    )}
                  >
                    {option.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;
