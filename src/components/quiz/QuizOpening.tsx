import { Button } from "@/components/ui/button";
import { Sparkles, Clock, Target, Users } from "lucide-react";

interface QuizOpeningProps {
  onStart: () => void;
}

const QuizOpening = ({ onStart }: QuizOpeningProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <div
          className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary opacity-0 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <Sparkles className="h-4 w-4" />
          Diagnóstico Estratégico Gratuito
        </div>

        <h1
          className="mb-6 text-3xl font-bold leading-tight text-secondary sm:text-4xl md:text-5xl opacity-0 animate-slide-up"
          style={{ animationDelay: "0.25s" }}
        >
          Por que algumas profissionais{" "}
          <span className="text-gradient">cobram 5x mais</span> e ainda
          são mais procuradas?
        </h1>

        <p
          className="mb-10 text-lg text-muted-foreground sm:text-xl opacity-0 animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          Responda 13 perguntas rápidas e descubra se o mercado te enxerga como{" "}
          <strong className="text-foreground">a escolha certa</strong> ou
          apenas mais uma opção.
        </p>

        <div
          className="mb-10 grid gap-4 sm:grid-cols-3 opacity-0 animate-slide-up"
          style={{ animationDelay: "0.55s" }}
        >
          <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card transition-transform hover:scale-[1.03]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">
              Resultado personalizado
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card transition-transform hover:scale-[1.03]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">
              Menos de 3 minutos
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card transition-transform hover:scale-[1.03]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">
              +2.400 profissionais fizeram
            </span>
          </div>
        </div>

        <div
          className="opacity-0 animate-slide-up"
          style={{ animationDelay: "0.7s" }}
        >
          <Button
            onClick={onStart}
            size="lg"
            className="h-14 rounded-full px-10 text-lg font-semibold shadow-brand transition-all hover:scale-105 animate-pulse-glow"
          >
            DESCOBRIR MEU POSICIONAMENTO
          </Button>

          <p className="mt-4 text-xs text-muted-foreground">
            100% gratuito. Sem cadastro para começar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizOpening;
