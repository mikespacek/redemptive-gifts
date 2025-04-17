"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import PageLayout from '../components/PageLayout';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import { getUserId } from '../lib/userId';
import { asQuery, asMutation } from '../lib/convex-helpers';

// Define Question type
interface Question {
  _id: string;
  text: string;
  giftType: string;
  order?: number;
}

export default function TestPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { giftType: string, score: number }>>({});
  const [userId, setUserId] = useState<string>('');
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get all questions from the database
  const questions = useQuery(asQuery<Question[]>(api.questions.getAll)) || [];
  
  // Mutations for saving answers
  const startSubmission = useMutation(asMutation(api.submissions.startSubmission));
  const saveAnswer = useMutation(asMutation(api.submissions.saveAnswer));
  const completeSubmission = useMutation(asMutation(api.submissions.completeSubmission));

  // Get/create user ID on component mount
  useEffect(() => {
    const id = getUserId();
    setUserId(id);
    
    // Start a new submission
    const initSubmission = async () => {
      try {
        const newSubmissionId = await startSubmission({ userId: id });
        setSubmissionId(newSubmissionId);
        setIsLoading(false);
      } catch (error) {
        console.error("Error starting submission:", error);
        setIsLoading(false);
      }
    };
    
    if (id) {
      initSubmission();
    }
  }, [startSubmission]);

  // Handler for when a question is answered
  const handleAnswer = async (questionId: string, giftType: string, score: number) => {
    // Update local state
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { giftType, score },
    }));
    
    // Save answer to the database
    if (submissionId) {
      try {
        await saveAnswer({
          submissionId,
          questionId,
          giftType,
          score,
        });
      } catch (error) {
        console.error("Error saving answer:", error);
      }
    }
  };

  // Navigate to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to the previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Complete the test
  const handleCompleteTest = async () => {
    if (!submissionId) return;
    
    setIsLoading(true);
    try {
      const result = await completeSubmission({ submissionId });
      
      // Navigate to results page
      router.push(`/results?resultId=${result.resultId}`);
    } catch (error) {
      console.error("Error completing submission:", error);
      setIsLoading(false);
    }
  };

  // Calculate progress
  const currentQuestion = questions[currentQuestionIndex] as Question | undefined;
  const totalQuestions = questions.length;
  const progress = Math.round((Object.keys(answers).length / totalQuestions) * 100);
  const isCurrentQuestionAnswered = currentQuestion && answers[currentQuestion._id]?.score > 0;
  const canComplete = progress === 100;

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container-custom py-12">
          <div className="text-center">
            <h1>Loading Test...</h1>
            <p>Please wait while we prepare your test questions.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1>Redemptive Gifts Test</h1>
            <p className="text-gray-600">
              For each statement, select how strongly you agree or disagree. Answer honestly
              based on how you actually are, not how you would like to be.
            </p>
          </div>

          <ProgressBar 
            currentQuestion={currentQuestionIndex + 1} 
            totalQuestions={totalQuestions} 
          />

          {currentQuestion && (
            <AnimatePresence mode="wait">
              <QuestionCard
                key={currentQuestion._id}
                questionId={currentQuestion._id}
                questionNumber={currentQuestionIndex + 1}
                text={currentQuestion.text}
                giftType={currentQuestion.giftType}
                totalQuestions={totalQuestions}
                onAnswer={handleAnswer}
                currentAnswer={answers[currentQuestion._id]?.score}
              />
            </AnimatePresence>
          )}

          <div className="mt-8 flex justify-between">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`btn-secondary ${
                currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Previous
            </button>

            <div className="flex gap-4">
              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  disabled={!isCurrentQuestionAnswered}
                  className={`btn-primary ${
                    !isCurrentQuestionAnswered ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleCompleteTest}
                  disabled={!canComplete}
                  className={`btn-primary ${
                    !canComplete ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Complete Test
                </button>
              )}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                {Object.keys(answers).length} of {totalQuestions} questions answered
              </span>
              <span className="text-sm font-medium text-gray-700">{progress}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 