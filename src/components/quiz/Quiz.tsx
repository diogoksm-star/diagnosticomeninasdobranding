import { useState, useCallback, useMemo } from "react";
import QuizOpening from "./QuizOpening";
import QuizQuestion from "./QuizQuestion";
import QuizLeadField from "./QuizLeadField";
import QuizAnalyzing from "./QuizAnalyzing";
import QuizResult from "./QuizResult";
import { quizQuestions, getResultByScore } from "./QuizData";

type QuizStep = "opening" | "questions" | "analyzing" | "result";

interface UtmParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
}

interface LeadFields {
  name: string;
  whatsapp: string;
  email: string;
}

// Steps in the quiz flow: questions intercalated with lead fields
// After question 3 → ask name
// After question 7 → ask whatsapp
// After question 11 → ask email
type FlowItemType = "question" | "lead_name" | "lead_whatsapp" | "lead_email";

interface FlowItem {
  type: FlowItemType;
  questionIndex?: number; // only for type "question"
}

// Build the flow: 13 questions + 3 lead fields = 16 total steps
const buildFlow = (): FlowItem[] => {
  const flow: FlowItem[] = [];
  for (let i = 0; i < quizQuestions.length; i++) {
    flow.push({ type: "question", questionIndex: i });
    if (i === 2) flow.push({ type: "lead_name" });
    if (i === 6) flow.push({ type: "lead_whatsapp" });
    if (i === 10) flow.push({ type: "lead_email" });
  }
  return flow;
};

const FLOW = buildFlow();
const TOTAL_STEPS = FLOW.length;

interface QuizState {
  step: QuizStep;
  flowIndex: number;
  answers: number[];
  leadData: LeadFields;
  totalScore: number;
}

const Quiz = () => {
  const [state, setState] = useState<QuizState>({
    step: "opening",
    flowIndex: 0,
    answers: [],
    leadData: { name: "", whatsapp: "", email: "" },
    totalScore: 0,
  });

  const utmParams = useMemo<UtmParams>(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_term: params.get("utm_term") || "",
      utm_content: params.get("utm_content") || "",
    };
  }, []);

  const advanceFlow = (newState: Partial<QuizState>) => {
    const nextIndex = (newState.flowIndex ?? state.flowIndex) + 1;

    if (nextIndex >= TOTAL_STEPS) {
      // Quiz complete — go to analyzing
      const finalScore = newState.totalScore ?? state.totalScore;
      const finalAnswers = newState.answers ?? state.answers;
      const finalLead = newState.leadData ?? state.leadData;

      setState((prev) => ({
        ...prev,
        ...newState,
        flowIndex: nextIndex,
        step: "analyzing",
      }));

      // Send lead data
      const result = getResultByScore(finalScore);
      const payload = {
        name: finalLead.name || "Visitante",
        email: finalLead.email,
        whatsapp: finalLead.whatsapp,
        answers: finalAnswers,
        totalScore: finalScore,
        result: result.id,
        resultTitle: result.title,
        timestamp: new Date().toISOString(),
        ...utmParams,
      };

      console.log("Lead captured:", payload);

      fetch("/api/send-to-kommo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) console.error("Kommo error:", data);
        })
        .catch((err) => console.error("Webhook error:", err));
    } else {
      setState((prev) => ({
        ...prev,
        ...newState,
        flowIndex: nextIndex,
      }));
    }
  };

  const handleStart = () => {
    setState((prev) => ({ ...prev, step: "questions" }));
  };

  const handleAnswer = (points: number) => {
    const newAnswers = [...state.answers, points];
    const newScore = state.totalScore + points;
    advanceFlow({
      answers: newAnswers,
      totalScore: newScore,
      flowIndex: state.flowIndex,
    });
  };

  const handleLeadField = (field: keyof LeadFields, value: string) => {
    const newLeadData = { ...state.leadData, [field]: value };
    advanceFlow({
      leadData: newLeadData,
      flowIndex: state.flowIndex,
    });
  };

  const handleLeadSkip = () => {
    advanceFlow({ flowIndex: state.flowIndex });
  };

  const handleAnalyzingComplete = useCallback(() => {
    setState((prev) => ({ ...prev, step: "result" }));
  }, []);

  const result = getResultByScore(state.totalScore);
  const currentFlowItem = FLOW[state.flowIndex] || FLOW[FLOW.length - 1];

  return (
    <div className="min-h-screen bg-background">
      {state.step === "opening" && <QuizOpening onStart={handleStart} />}

      {state.step === "questions" && currentFlowItem.type === "question" && (
        <QuizQuestion
          question={quizQuestions[currentFlowItem.questionIndex!]}
          currentIndex={state.flowIndex}
          totalQuestions={TOTAL_STEPS}
          onAnswer={handleAnswer}
        />
      )}

      {state.step === "questions" && currentFlowItem.type === "lead_name" && (
        <QuizLeadField
          field="name"
          currentIndex={state.flowIndex}
          totalQuestions={TOTAL_STEPS}
          onSubmit={(val) => handleLeadField("name", val)}
          onSkip={handleLeadSkip}
        />
      )}

      {state.step === "questions" && currentFlowItem.type === "lead_whatsapp" && (
        <QuizLeadField
          field="whatsapp"
          currentIndex={state.flowIndex}
          totalQuestions={TOTAL_STEPS}
          onSubmit={(val) => handleLeadField("whatsapp", val)}
          onSkip={handleLeadSkip}
        />
      )}

      {state.step === "questions" && currentFlowItem.type === "lead_email" && (
        <QuizLeadField
          field="email"
          currentIndex={state.flowIndex}
          totalQuestions={TOTAL_STEPS}
          onSubmit={(val) => handleLeadField("email", val)}
          onSkip={handleLeadSkip}
        />
      )}

      {state.step === "analyzing" && (
        <QuizAnalyzing onComplete={handleAnalyzingComplete} />
      )}

      {state.step === "result" && (
        <QuizResult
          result={result}
          score={state.totalScore}
          userName={state.leadData.name}
        />
      )}
    </div>
  );
};

export default Quiz;
