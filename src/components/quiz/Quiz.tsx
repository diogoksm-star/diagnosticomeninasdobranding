import { useState, useCallback, useMemo } from "react";
import QuizOpening from "./QuizOpening";
import QuizQuestion from "./QuizQuestion";
import QuizDataCapture, { LeadData } from "./QuizDataCapture";
import QuizAnalyzing from "./QuizAnalyzing";
import QuizResult from "./QuizResult";
import { quizQuestions, getResultByScore } from "./QuizData";
import { supabase } from "@/integrations/supabase/client";

type QuizStep = "opening" | "questions" | "capture" | "analyzing" | "result";

interface UtmParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
}

interface QuizState {
  step: QuizStep;
  currentQuestionIndex: number;
  answers: number[];
  leadData: LeadData | null;
  totalScore: number;
}

const Quiz = () => {
  const [state, setState] = useState<QuizState>({
    step: "opening",
    currentQuestionIndex: 0,
    answers: [],
    leadData: null,
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

  const handleStart = () => {
    setState((prev) => ({ ...prev, step: "questions" }));
  };

  const handleAnswer = (points: number) => {
    const newAnswers = [...state.answers, points];
    const newScore = state.totalScore + points;
    const nextQuestionIndex = state.currentQuestionIndex + 1;

    if (nextQuestionIndex >= quizQuestions.length) {
      setState((prev) => ({
        ...prev,
        answers: newAnswers,
        totalScore: newScore,
        step: "capture",
      }));
    } else {
      setState((prev) => ({
        ...prev,
        answers: newAnswers,
        totalScore: newScore,
        currentQuestionIndex: nextQuestionIndex,
      }));
    }
  };

  const handleLeadCapture = (data: LeadData) => {
    setState((prev) => ({
      ...prev,
      leadData: data,
      step: "analyzing",
    }));

    const result = getResultByScore(state.totalScore);
    
    const payload = {
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      answers: state.answers,
      totalScore: state.totalScore,
      result: result.id,
      resultTitle: result.title,
      timestamp: new Date().toISOString(),
      ...utmParams,
    };

    console.log("Lead captured:", payload);

    // Send to Kommo via Edge Function (fire-and-forget)
    supabase.functions
      .invoke("send-to-kommo", { body: payload })
      .then(({ error }) => {
        if (error) console.error("Webhook error:", error);
      });
  };

  const handleAnalyzingComplete = useCallback(() => {
    setState((prev) => ({ ...prev, step: "result" }));
  }, []);

  const result = getResultByScore(state.totalScore);

  return (
    <div className="min-h-screen bg-background">
      {state.step === "opening" && <QuizOpening onStart={handleStart} />}

      {state.step === "questions" && (
        <QuizQuestion
          question={quizQuestions[state.currentQuestionIndex]}
          currentIndex={state.currentQuestionIndex}
          totalQuestions={quizQuestions.length}
          onAnswer={handleAnswer}
        />
      )}

      {state.step === "capture" && (
        <QuizDataCapture onSubmit={handleLeadCapture} />
      )}

      {state.step === "analyzing" && (
        <QuizAnalyzing onComplete={handleAnalyzingComplete} />
      )}

      {state.step === "result" && state.leadData && (
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
