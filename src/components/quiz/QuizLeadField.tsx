import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Lock, AlertCircle } from "lucide-react";
import QuizProgress from "./QuizProgress";

interface QuizLeadFieldProps {
  field: "name" | "whatsapp" | "email";
  currentIndex: number;
  totalQuestions: number;
  onSubmit: (value: string) => void;
  onSkip: () => void;
}

const fieldConfig = {
  name: {
    question: "Antes de continuar, como podemos te chamar?",
    placeholder: "Seu primeiro nome",
    type: "text",
    subtitle: "Para personalizar seu resultado",
    inputMode: "text" as const,
  },
  whatsapp: {
    question: "Qual seu WhatsApp?",
    placeholder: "(00) 00000-0000",
    type: "tel",
    subtitle: "Enviamos seu resultado completo por lá. Zero spam.",
    inputMode: "tel" as const,
  },
  email: {
    question: "Qual seu melhor e-mail?",
    placeholder: "seu@email.com",
    type: "email",
    subtitle: "Para garantir que você receba tudo.",
    inputMode: "email" as const,
  },
};

const formatWhatsApp = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  if (cleaned.length <= 11)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateWhatsApp = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 11;
};

const QuizLeadField = ({
  field,
  currentIndex,
  totalQuestions,
  onSubmit,
  onSkip,
}: QuizLeadFieldProps) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const config = fieldConfig[field];

  useEffect(() => {
    const t = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const handleChange = (val: string) => {
    setError("");
    if (field === "whatsapp") {
      setValue(formatWhatsApp(val));
    } else {
      setValue(val);
    }
  };

  const validate = (): boolean => {
    const trimmed = value.trim();
    if (!trimmed) return true; // empty = skip, no validation needed

    if (field === "email" && !validateEmail(trimmed)) {
      setError("Digite um e-mail válido");
      return false;
    }

    if (field === "whatsapp" && !validateWhatsApp(trimmed)) {
      setError("Digite um número válido com DDD");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (isAnimating) return;

    if (!value.trim()) {
      setIsVisible(false);
      setTimeout(() => onSkip(), 200);
      return;
    }

    if (!validate()) return;

    setIsAnimating(true);
    setIsVisible(false);
    setTimeout(() => {
      onSubmit(value.trim());
      setIsAnimating(false);
    }, 250);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasError = error.length > 0;

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
          <h2 className="mb-2 text-center text-xl font-semibold text-secondary sm:text-2xl md:text-3xl">
            {config.question}
          </h2>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            {config.subtitle}
          </p>

          <div className="mx-auto max-w-md space-y-3">
            <div>
              <input
                type={config.type}
                inputMode={config.inputMode}
                placeholder={config.placeholder}
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className={cn(
                  "w-full rounded-2xl border-2 bg-card p-4 text-center text-lg font-medium",
                  "outline-none transition-all duration-300",
                  "placeholder:text-muted-foreground/40",
                  hasError
                    ? "border-destructive ring-2 ring-destructive/20"
                    : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-brand"
                )}
              />
              {hasError && (
                <div className="mt-2 flex items-center justify-center gap-1.5 text-sm text-destructive animate-fade-in">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isAnimating}
              className={cn(
                "w-full rounded-2xl border-2 p-4 text-center text-lg font-semibold transition-all duration-300",
                value.trim()
                  ? "border-primary bg-primary text-primary-foreground hover:brightness-110 shadow-brand"
                  : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
              )}
            >
              {value.trim() ? "Continuar" : "Pular"}
            </button>

            <div className="flex items-center justify-center gap-1.5 pt-1 text-xs text-muted-foreground/60">
              <Lock className="h-3 w-3" />
              <span>Seus dados ficam seguros</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizLeadField;
