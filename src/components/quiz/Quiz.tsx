import { useState, useCallback } from "react";
import QuizOpening from "./QuizOpening";
import QuizQuestion from "./QuizQuestion";
import QuizDataCapture, { LeadData } from "./QuizDataCapture";
import QuizAnalyzing from "./QuizAnalyzing";
import QuizWhatsAppRedirect from "./QuizWhatsAppRedirect";
import { quizQuestions, getResultByScore } from "./QuizData";

type QuizStep = "opening" | "questions" | "capture" | "analyzing" | "whatsapp";

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
    
    // Log data for future Kommo integration
    console.log("Lead captured:", {
      ...data,
      answers: state.answers,
      totalScore: state.totalScore,
      result: result.id,
    });
  };

  const handleAnalyzingComplete = useCallback(() => {
    setState((prev) => ({ ...prev, step: "whatsapp" }));
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

      {state.step === "whatsapp" && state.leadData && (
        <QuizWhatsAppRedirect
          resultId={result.id}
          userName={state.leadData.name}
        />
      )}
    </div>
  );
};

export default Quiz;
