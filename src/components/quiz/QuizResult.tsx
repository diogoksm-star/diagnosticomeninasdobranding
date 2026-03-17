import { Button } from "@/components/ui/button";
import { QuizResult as QuizResultType } from "./QuizData";
import { cn } from "@/lib/utils";
import { MessageCircle, ArrowRight } from "lucide-react";

interface QuizResultProps {
  result: QuizResultType;
  score: number;
  userName?: string;
  whatsappNumber?: string;
}

const QuizResult = ({ result, score, userName, whatsappNumber }: QuizResultProps) => {
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

  const whatsappMessages: Record<string, string> = {
    invisivel: "Olá! Fiz o diagnóstico de posicionamento e meu resultado foi: Posicionamento Invisível 🔴. Quero entender como mudar isso.",
    notado: "Olá! Fiz o diagnóstico de posicionamento e meu resultado foi: Posicionamento Notado 🟠. Quero dar o próximo passo.",
    diferenciado: "Olá! Fiz o diagnóstico de posicionamento e meu resultado foi: Posicionamento Diferenciado 🟢. Quero consolidar meu território.",
  };

  const handleCTA = () => {
    const message = whatsappMessages[result.id] || whatsappMessages.invisivel;
    const fullMessage = encodeURIComponent(`${message}\n\nMeu nome: ${userName || "Não informado"}\nPontuação: ${score}/65`);
    const number = whatsappNumber || "556599153409";
    window.open(`https://wa.me/${number}?text=${fullMessage}`, "_blank");
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Greeting */}
        {userName && (
          <p
            className="mb-4 text-center text-lg text-muted-foreground opacity-0 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            {userName}, aqui está seu diagnóstico:
          </p>
        )}

        {/* Result Badge */}
        <div
          className="mb-6 text-center opacity-0 animate-badge-in"
          style={{ animationDelay: "0.3s" }}
        >
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border-2 px-6 py-3 text-lg font-bold",
              getResultColor()
            )}
          >
            {getResultEmoji()} {result.title}
          </span>
        </div>

        {/* Score */}
        <div
          className="mb-8 text-center opacity-0 animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          <p className="text-sm text-muted-foreground">
            Sua pontuação: <span className="font-bold text-foreground">{score}</span> de 65
            pontos
          </p>
        </div>

        {/* Result Content */}
        <div
          className="mb-10 rounded-3xl bg-card p-6 shadow-card sm:p-8 opacity-0 animate-slide-up"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="space-y-5">
            {result.content.map((paragraph, index) => (
              <p
                key={index}
                className={cn(
                  "leading-relaxed opacity-0 animate-text-reveal",
                  index < 2
                    ? "text-xl font-semibold text-secondary sm:text-2xl"
                    : "text-base text-muted-foreground sm:text-lg"
                )}
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div
          className="rounded-3xl border-2 border-primary/20 bg-primary/5 p-6 text-center sm:p-8 opacity-0 animate-slide-up"
          style={{ animationDelay: `${0.8 + result.content.length * 0.1 + 0.2}s` }}
        >
          <h3 className="mb-2 text-xl font-bold text-secondary sm:text-2xl">
            {result.id === "invisivel" && "Pronta pra sair da invisibilidade?"}
            {result.id === "notado" && "Pronta pra virar a escolha óbvia?"}
            {result.id === "diferenciado" && "Pronta pra se tornar incomparável?"}
          </h3>
          <p className="mb-6 text-muted-foreground">
            Fale com nossa equipe e descubra o caminho personalizado para o seu próximo nível.
          </p>
          <Button
            onClick={handleCTA}
            size="lg"
            className="h-16 w-full sm:w-auto whitespace-normal rounded-full px-6 sm:px-12 text-base sm:text-lg font-bold shadow-brand transition-all hover:scale-105 hover:brightness-110 gap-2 animate-pulse-glow"
          >
            <MessageCircle className="h-5 w-5" />
            Falar com a equipe no WhatsApp
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Atendimento humano. Sem robô, sem spam.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
