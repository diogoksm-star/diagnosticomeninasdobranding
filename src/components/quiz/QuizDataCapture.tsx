import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

export interface LeadData {
  name: string;
  email: string;
  whatsapp: string;
}

interface QuizDataCaptureProps {
  onSubmit: (data: LeadData) => void;
}

const QuizDataCapture = ({ onSubmit }: QuizDataCaptureProps) => {
  const [formData, setFormData] = useState<LeadData>({
    name: "",
    email: "",
    whatsapp: "",
  });
  const [errors, setErrors] = useState<Partial<LeadData>>({});

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateWhatsApp = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length >= 10 && cleaned.length <= 11;
  };

  const formatWhatsApp = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    if (cleaned.length <= 11)
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  const handleChange = (field: keyof LeadData, value: string) => {
    let formattedValue = value;
    if (field === "whatsapp") {
      formattedValue = formatWhatsApp(value);
    }
    setFormData((prev) => ({ ...prev, [field]: formattedValue }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<LeadData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = "WhatsApp é obrigatório";
    } else if (!validateWhatsApp(formData.whatsapp)) {
      newErrors.whatsapp = "WhatsApp inválido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md animate-fade-up">
        <div className="rounded-3xl bg-card p-8 shadow-card">
          <div className="mb-6 text-center">
            <h2 className="mb-3 text-2xl font-bold text-secondary sm:text-3xl">
              Antes de ver seu diagnóstico…
            </h2>
            <p className="text-muted-foreground">
              Queremos te entregar um resultado personalizado e, se fizer
              sentido, te mostrar o próximo passo para se tornar incomparável.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Nome
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="h-12 rounded-xl border-border bg-background"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="h-12 rounded-xl border-border bg-background"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-foreground">
                WhatsApp
              </Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                className="h-12 rounded-xl border-border bg-background"
              />
              {errors.whatsapp && (
                <p className="text-sm text-destructive">{errors.whatsapp}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-14 w-full rounded-full text-lg font-semibold shadow-brand transition-all hover:scale-[1.02]"
            >
              👉 VER MEU RESULTADO
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>Seus dados estão seguros conosco</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDataCapture;
