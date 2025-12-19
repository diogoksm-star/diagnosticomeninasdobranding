import { Button } from "@/components/ui/button";
import { QuizResult as QuizResultType } from "./QuizData";
import { cn } from "@/lib/utils";

interface QuizResultProps {
  result: QuizResultType;
  score: number;
  whatsappNumber?: string;
}

const QuizResult = ({ result, score, whatsappNumber }: QuizResultProps) => {
  const getResultColor = () => {
    switch (result.id) {
      case "invisivel":
        return "bg-destructive/10 text-destructive border-destructive/30";
      case "notado":
        return "bg-accent/10 text-accent border-accent/30";
      case "diferenciado":
        return "bg-primary/10 text-primary border-primary/30";
      default:
        return "bg-primary/10 text-primary border-primary/30";
    }
  };

  const getResultEmoji = () => {
    switch (result.id) {
      case "invisivel":
        return "🔴";
      case "notado":
        return "🟠";
      case "diferenciado":
        return "🟢";
      default:
        return "✨";
    }
  };

  const handleCTA = () => {
    const message = encodeURIComponent(
      `Olá! Fiz o diagnóstico de posicionamento e meu resultado foi: ${result.title}. Quero ser incomparável!`
    );
    const number = whatsappNumber || "5500000000000";
    window.open(`https://wa.me/${number}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="animate-fade-up">
          {/* Result Badge */}
          <div className="mb-6 text-center">
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full border-2 px-6 py-3 text-lg font-bold",
                getResultColor()
              )}
            >
              {getResultEmoji()} {result.title}
            </span>
          </div>

          {/* Score Display */}
          <div className="mb-8 text-center">
            <p className="text-sm text-muted-foreground">
              Sua pontuação: <span className="font-bold">{score}</span> de 65
              pontos
            </p>
          </div>

          {/* Result Content */}
          <div className="mb-10 space-y-6 rounded-3xl bg-card p-6 shadow-card sm:p-8">
            {result.content.map((paragraph, index) => (
              <p
                key={index}
                className={cn(
                  "leading-relaxed",
                  index < 2
                    ? "text-xl font-semibold text-secondary sm:text-2xl"
                    : "text-base text-muted-foreground sm:text-lg"
                )}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button
              onClick={handleCTA}
              size="lg"
              className="h-16 rounded-full px-12 text-lg font-bold shadow-brand transition-all hover:scale-105 sm:text-xl"
            >
              👉 QUERO SER INCOMPARÁVEL
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
