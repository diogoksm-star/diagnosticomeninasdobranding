import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { quizQuestions } from "@/components/quiz/QuizData";
import { Eye } from "lucide-react";

interface LeadAnswersDialogProps {
  answers: number[];
  leadName: string;
}

const LeadAnswersDialog = ({ answers, leadName }: LeadAnswersDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 gap-1 rounded-full text-xs">
          <Eye className="h-3 w-3" />
          Ver detalhes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-secondary">
            Respostas de {leadName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          {quizQuestions.map((q, index) => {
            const answerPoints = answers?.[index];
            const chosenOption = q.options.find((o) => o.points === answerPoints);

            return (
              <div
                key={q.id}
                className="rounded-xl border border-border bg-muted/30 p-3"
              >
                <p className="text-xs font-semibold text-muted-foreground">
                  Pergunta {q.id}
                </p>
                <p className="mb-1 text-sm font-medium text-secondary">
                  {q.question}
                </p>
                {chosenOption ? (
                  <p className="text-sm text-primary">
                    {chosenOption.label}) {chosenOption.text}{" "}
                    <span className="text-xs text-muted-foreground">
                      ({chosenOption.points} pts)
                    </span>
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Sem resposta
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadAnswersDialog;
