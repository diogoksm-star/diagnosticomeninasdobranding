import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { QuizQuestion as QuizQuestionType } from "./QuizData";
import QuizProgress from "./QuizProgress";

interface QuizQuestionProps {
  question: QuizQuestionType;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (points: number) => void;
}

const motivationalCopy: Record<number, string> = {
  4: "Estamos vendo um padrão no seu posicionamento...",
  7: "Falta pouco. As próximas respostas definem tudo.",
  10: "Quase lá. O resultado já está tomando forma...",
  13: "Última pergunta. Sua resposta fecha o diagnóstico.",
};

const QuizQuestion = ({
  question,
  currentIndex,
  totalQuestions,
  onAnswer,
}: QuizQuestionProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const t = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(t);
  }, [question.id]);

  const handleSelect = (index: number, points: number) => {
    if (isAnimating) return;

    setSelectedIndex(index);
    setIsAnimating(true);

    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onAnswer(points);
        setSelectedIndex(null);
        setIsAnimating(false);
      }, 150);
    }, 300);
  };

  const microCopy = motivationalCopy[question.id];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8">
          <QuizProgress current={currentIndex + 1} total={totalQuestions} />
        </div>

        <div
          className={cn(
            "transition-all duration-300",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
        >
          {microCopy && (
            <div className="mb-5 flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                {microCopy}
              </span>
            </div>
          )}

          <h2 className="mb-8 text-center text-xl font-semibold text-secondary sm:text-2xl md:text-3xl">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={option.label}
                onClick={() => handleSelect(index, option.points)}
                disabled={isAnimating}
                style={{
                  animationDelay: `${index * 0.06}s`,
                }}
                className={cn(
                  "group w-full rounded-2xl border-2 p-4 text-left opacity-0 animate-option-in",
                  "transition-all duration-200",
                  "hover:border-primary hover:bg-primary/5 hover:shadow-brand",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "active:scale-[0.97]",
                  selectedIndex === index
                    ? "border-primary bg-primary/10 scale-[0.98]"
                    : selectedIndex !== null && selectedIndex !== index
                    ? "border-border bg-card opacity-50"
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-200",
                      selectedIndex === index
                        ? "border-primary bg-primary text-primary-foreground scale-110"
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
