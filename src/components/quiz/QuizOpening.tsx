import { Button } from "@/components/ui/button";
import { Sparkles, Clock, Target } from "lucide-react";

interface QuizOpeningProps {
  onStart: () => void;
}

const QuizOpening = ({ onStart }: QuizOpeningProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto max-w-2xl text-center animate-fade-up">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          Diagnóstico Estratégico
        </div>

        <h1 className="mb-6 text-3xl font-bold leading-tight text-secondary sm:text-4xl md:text-5xl">
          Descubra seu nível de{" "}
          <span className="text-primary">posicionamento</span> no mercado
        </h1>

        <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
          E entenda por que algumas profissionais cobram mais sem precisar se
          explicar — enquanto outras vivem sendo comparadas por preço.
        </p>

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">
              Diagnóstico estratégico
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">
              Menos de 3 minutos
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">
              Percepção de valor
            </span>
          </div>
        </div>

        <Button
          onClick={onStart}
          size="lg"
          className="h-14 rounded-full px-10 text-lg font-semibold shadow-brand transition-all hover:scale-105"
        >
          👉 COMEÇAR DIAGNÓSTICO
        </Button>
      </div>
    </div>
  );
};

export default QuizOpening;
