import { useState, useCallback } from "react";
import QuizOpening from "./QuizOpening";
import QuizQuestion from "./QuizQuestion";
import QuizDataCapture, { LeadData } from "./QuizDataCapture";
import QuizAnalyzing from "./QuizAnalyzing";
import QuizResult from "./QuizResult";
import { quizQuestions, getResultByScore } from "./QuizData";

type QuizStep = "opening" | "questions" | "capture" | "analyzing" | "result";

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

    // Here you would typically send the data to your CRM (Kommo)
    console.log("Lead captured:", {
      ...data,
      answers: state.answers,
      totalScore: state.totalScore,
      result: getResultByScore(state.totalScore).id,
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

      {state.step === "result" && (
        <QuizResult result={result} score={state.totalScore} />
      )}
    </div>
  );
};

export default Quiz;
