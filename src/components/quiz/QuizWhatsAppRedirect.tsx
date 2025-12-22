import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface QuizWhatsAppRedirectProps {
  resultId: string;
  userName: string;
  whatsappNumber?: string;
}

const whatsappMessages: Record<string, string> = {
  invisivel: "Olá! Fiz o diagnóstico de posicionamento e quero receber meu resultado: Posicionamento Invisível 🔴",
  notado: "Olá! Fiz o diagnóstico de posicionamento e quero receber meu resultado: Posicionamento Notado 🟠",
  diferenciado: "Olá! Fiz o diagnóstico de posicionamento e quero receber meu resultado: Posicionamento Diferenciado 🟢",
};

const QuizWhatsAppRedirect = ({
  resultId,
  userName,
  whatsappNumber = "5500000000000",
}: QuizWhatsAppRedirectProps) => {
  const handleWhatsAppClick = () => {
    const message = whatsappMessages[resultId] || whatsappMessages.invisivel;
    const fullMessage = encodeURIComponent(`${message}\n\nMeu nome: ${userName}`);
    window.open(`https://wa.me/${whatsappNumber}?text=${fullMessage}`, "_blank");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="mx-auto max-w-lg text-center">
        <div className="animate-fade-up">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-14 w-14 text-primary animate-scale-in" />
            </div>
          </div>

          {/* Headline */}
          <h1 className="mb-4 text-3xl font-bold text-secondary sm:text-4xl">
            Seu diagnóstico está pronto!
          </h1>

          {/* Subheadline */}
          <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
            Clique no botão abaixo para receber seu resultado personalizado no WhatsApp
          </p>

          {/* CTA Button */}
          <Button
            onClick={handleWhatsAppClick}
            size="lg"
            className="h-16 rounded-full px-12 text-lg font-bold shadow-brand transition-all hover:scale-105 sm:text-xl"
          >
            👉 RECEBER MEU DIAGNÓSTICO
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizWhatsAppRedirect;
