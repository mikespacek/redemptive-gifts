"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import PageLayout from '../components/PageLayout';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import UserInfoForm from '../components/UserInfoForm';
import { getUserId, storeUserInfo, extractFirstName, getUserInfo, UserInfo } from '../lib/userId';
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
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showUserForm, setShowUserForm] = useState(true);

  // Get all questions from the database
  const questions = useQuery(asQuery<Question[]>(api.questions.getAll));
  const [questionsError, setQuestionsError] = useState<string | null>(null);

  // Check if questions loaded successfully
  useEffect(() => {
    if (questions === undefined && !isLoading) {
      console.error("Failed to load questions");
      setQuestionsError("Failed to load questions. Please check your connection and try again.");
    } else if (Array.isArray(questions) && questions.length === 0) {
      console.error("No questions found in the database");
      setQuestionsError("No questions found. Please contact support.");
    } else if (questions !== undefined) {
      setQuestionsError(null);
    }
  }, [questions, isLoading]);

  // Mutations for saving answers
  const startSubmission = useMutation(asMutation(api.submissions.startSubmission));
  const saveAnswer = useMutation(asMutation(api.submissions.saveAnswer));
  const completeSubmission = useMutation(asMutation(api.submissions.completeSubmission));

  // Get/create user ID and check for existing user info on component mount
  useEffect(() => {
    const info = getUserInfo();
    if (info) {
      setUserInfo(info);
      setUserId(info.userId);

      // If we already have the user's full name and email, skip the form
      if (info.fullName && info.email) {
        setShowUserForm(false);
        // We'll start the submission in a separate effect when showUserForm changes
      }
    } else {
      const id = getUserId();
      setUserId(id);
    }

    // Always set loading to false initially
    setIsLoading(false);
  }, []);

  // Handle submission initialization when form is skipped
  useEffect(() => {
    // Only start a submission if we're not showing the user form and we have a userId
    if (!showUserForm && userId) {
      setIsLoading(true);
      // Use a non-async function to start the submission
      const startNewSubmission = () => {
        startSubmission({ userId })
          .then(newSubmissionId => {
            setSubmissionId(newSubmissionId);
            setIsLoading(false);
          })
          .catch(error => {
            console.error("Error starting submission:", error);
            setIsLoading(false);
          });
      };

      startNewSubmission();
    }
  }, [showUserForm, userId]);

  // Handler for when a question is answered
  const handleAnswer = (questionId: string, giftType: string, score: number) => {
    // Update local state
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { giftType, score },
    }));

    // Auto-advance to next question after a short delay
    if (currentQuestionIndex < totalQuestions - 1) {
      // Use a timeout to give visual feedback that the selection was registered
      setTimeout(() => {
        // Use functional update to avoid closure issues with stale state
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      }, 300);
    }

    // Save answer to the database (non-blocking)
    if (submissionId) {
      // Don't await this - let it happen in the background
      saveAnswer({
        submissionId,
        questionId,
        giftType,
        score,
      }).catch(error => {
        console.error("Error saving answer:", error);
      });
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

  // Handle user info form submission
  const handleUserInfoSubmit = (fullName: string, email: string) => {
    const firstName = extractFirstName(fullName);
    const newUserInfo = {
      userId,
      fullName,
      email,
      firstName
    };

    // Store user info
    storeUserInfo(newUserInfo);
    setUserInfo(newUserInfo);
    setShowUserForm(false);

    // The submission will be started by the useEffect that watches showUserForm
    // This avoids async issues in event handlers
  };

  // Complete the test
  const handleCompleteTest = async () => {
    if (!submissionId) return;

    setIsLoading(true);
    try {
      // Include user info in the submission
      const result = await completeSubmission({
        submissionId,
        userInfo: userInfo || { userId }
      });

      // Navigate to results page with a small delay to ensure data is processed
      setTimeout(() => {
        router.push(`/results?resultId=${result.resultId}`);
      }, 500);
    } catch (error) {
      console.error("Error completing submission:", error);
      setIsLoading(false);

      // If there's an error, try to navigate to results by user ID as fallback
      if (error instanceof Error && error.message.includes("schema")) {
        console.log("Attempting fallback navigation to results by user ID");
        setTimeout(() => {
          router.push(`/results`);
        }, 500);
      }
    }
  };

  // Calculate progress
  const questionsArray = questions || [];
  const currentQuestion = questionsArray[currentQuestionIndex] as Question | undefined;
  const totalQuestions = questionsArray.length;
  const progress = totalQuestions > 0 ? Math.round((Object.keys(answers).length / totalQuestions) * 100) : 0;
  const isCurrentQuestionAnswered = currentQuestion && answers[currentQuestion._id]?.score > 0;
  const canComplete = progress === 100 && totalQuestions > 0;

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-12 max-w-6xl">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-800 rounded-lg w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-800 rounded-lg w-full mb-2"></div>
              <div className="h-4 bg-gray-800 rounded-lg w-5/6 mx-auto mb-10"></div>

              <div className="flex justify-between items-center mb-3">
                <div className="h-5 bg-gray-800 rounded-lg w-1/4"></div>
                <div className="h-6 bg-gray-700 rounded-full w-20 border border-gray-600"></div>
              </div>
              <div className="h-3 bg-gray-800 rounded-full mb-8 border border-gray-700"></div>

              <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 border border-gray-200">
                <div className="h-6 bg-gray-100 rounded-full w-1/4 mb-6 border border-gray-200"></div>
                <div className="h-6 bg-gray-200 rounded-lg w-full mb-8"></div>
                <div className="grid grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-20 bg-gray-100 rounded-xl border border-gray-200"></div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <div className="h-12 bg-gray-800 rounded-xl w-32 border border-gray-700"></div>
                <div className="h-12 bg-gray-700 rounded-xl w-32 border border-gray-600"></div>
              </div>
            </div>
            <p className="mt-10 text-gray-400 font-medium">Loading your test questions...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Display error message if questions failed to load
  if (questionsError) {
    return (
      <PageLayout>
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-12 max-w-6xl">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-red-100">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Questions</h2>
              <p className="text-gray-700 mb-6">{questionsError}</p>
              <p className="text-gray-600 text-sm mb-6">
                This could be due to a connection issue or a problem with the database.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-12 max-w-6xl">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 sm:mb-10 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-black">Redemptive Gifts Test</h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
              For each statement, select how strongly you agree or disagree. Answer honestly
              based on how you actually are, not how you would like to be.
            </p>
          </div>

          {showUserForm ? (
            <div className="max-w-xl mx-auto">
              <UserInfoForm onSubmit={handleUserInfoSubmit} />
            </div>
          ) : (
            <>
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

              <div className="mt-8 sm:mt-10 flex justify-between">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`px-5 py-3 sm:px-7 sm:py-4 rounded-xl border border-gray-700 bg-gray-900 text-gray-300 font-medium shadow-custom transition-all hover:bg-gray-800 ${
                    currentQuestionIndex === 0 ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </span>
                </button>

                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    disabled={!isCurrentQuestionAnswered}
                    className={`px-5 py-3 sm:px-7 sm:py-4 rounded-xl bg-gray-800 text-white font-medium shadow-md transition-all hover:bg-gray-700 border border-gray-700 ${
                      !isCurrentQuestionAnswered ? 'opacity-40 cursor-not-allowed bg-gray-900 hover:bg-gray-900' : ''
                    }`}
                  >
                    <span className="flex items-center">
                      Next
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={handleCompleteTest}
                    disabled={!canComplete}
                    className={`px-5 py-3 sm:px-7 sm:py-4 rounded-xl bg-gray-700 text-white font-medium shadow-md transition-all hover:bg-gray-600 border border-gray-600 ${
                      !canComplete ? 'opacity-40 cursor-not-allowed bg-gray-900 hover:bg-gray-900 border-gray-800' : ''
                    }`}
                  >
                    <span className="flex items-center">
                      Complete Test
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}