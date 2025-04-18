"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from './PageLayout';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';
import UserInfoForm from './UserInfoForm';
import { getUserId, storeUserInfo, extractFirstName, getUserInfo, clearUserInfo, UserInfo } from '../lib/userId';
import { questions, giftTypeMapping } from '../data/redemptiveGiftsQuestions';
import { sendResultToGoogleSheet } from '../lib/google-sheets';
import { sendResultsEmailJS } from '../lib/emailjs';

export default function StaticTestContent() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { giftType: string, score: number }>>({});
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showUserForm, setShowUserForm] = useState(true);

  // Get/create user ID and always show the user form
  useEffect(() => {
    // Clear any existing user info to ensure the form is shown
    clearUserInfo();

    // Get or create a user ID for tracking purposes
    const id = getUserId();
    setUserId(id);

    // Always show the user form
    setShowUserForm(true);

    // Set loading to false after a short delay to simulate data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handler for when a question is answered
  const handleAnswer = (questionId: string, giftType: string, score: number) => {
    console.log('Answer selected:', { questionId, giftType, score });

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
  };

  // Complete the test
  const handleCompleteTest = async () => {
    // Set loading state
    setIsLoading(true);

    // Calculate results based on answers
    const scores: Record<string, number> = {
      prophet: 0,
      servant: 0,
      teacher: 0,
      exhorter: 0,
      giver: 0,
      ruler: 0,
      mercy: 0
    };

    // Sum up scores by gift type
    Object.values(answers).forEach(answer => {
      scores[answer.giftType] += answer.score;
    });

    // Find dominant and secondary gifts
    let dominantGift = "prophet";
    let secondaryGift = "prophet";
    let highestScore = 0;
    let secondHighestScore = 0;

    Object.entries(scores).forEach(([gift, score]) => {
      if (score > highestScore) {
        secondHighestScore = highestScore;
        secondaryGift = dominantGift;
        highestScore = score;
        dominantGift = gift;
      } else if (score > secondHighestScore) {
        secondHighestScore = score;
        secondaryGift = gift;
      }
    });

    // Log the calculated scores for debugging
    console.log('Calculated gift scores:', scores);

    // Store results in localStorage with detailed scores for each gift type
    const results = {
      userId,
      scores,
      dominantGift,
      secondaryGift,
      timestamp: Date.now(),
      fullName: userInfo?.fullName,
      email: userInfo?.email,
      firstName: userInfo?.firstName,
      // Add detailed breakdown by column for the results sheet (for backward compatibility)
      columnScores: {
        T: scores.teacher,  // Column 1
        G: scores.giver,    // Column 2
        R: scores.ruler,    // Column 3
        E: scores.exhorter, // Column 4
        M: scores.mercy,    // Column 5
        P: scores.prophet,  // Column 6
        S: scores.servant   // Column 7
      }
    };

    console.log('Test results object:', results);

    localStorage.setItem('testResults', JSON.stringify(results));

    // Send results to Google Sheet and email
    try {
      // Only send to Google Sheets if we have user info
      if (userInfo?.fullName && userInfo?.email) {
        console.log('Attempting to send results to Google Sheet...');
        await sendResultToGoogleSheet(results);
        console.log('Results sent to Google Sheet');

        // Send email to admin using EmailJS
        console.log('Sending email notification to admin using EmailJS...');
        try {
          const emailResult = await sendResultsEmailJS(results);
          console.log('EmailJS result:', emailResult);

          if (!emailResult.success) {
            console.error('EmailJS failed:', emailResult.message);
          }
        } catch (emailError) {
          console.error('Error sending email with EmailJS:', emailError);
        }
      } else {
        console.log('Not sending to Google Sheet or email - missing user info');
      }
    } catch (error) {
      console.error('Error sending results:', error);
      // Continue anyway - we don't want to block the user from seeing their results
    } finally {
      setIsLoading(false);
      // Navigate to results page
      router.push('/results');
    }
  };

  // Calculate progress
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? Math.round((Object.keys(answers).length / totalQuestions) * 100) : 0;

  // Create the question ID in the same format used in handleAnswer
  const currentQuestionId = currentQuestion ? `q${currentQuestion.id}` : '';
  const isCurrentQuestionAnswered = currentQuestion && answers[currentQuestionId]?.score > 0;

  // For debugging
  console.log('Current question:', currentQuestion);
  console.log('Current question ID:', currentQuestionId);
  console.log('Answers:', answers);
  console.log('Is current question answered:', isCurrentQuestionAnswered);

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

  return (
    <PageLayout>
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-12 max-w-6xl">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 sm:mb-10 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-black">Your Design</h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
              For each statement, select how strongly you agree or disagree. Answer honestly
              based on how you actually are, not how you would like to be.
            </p>
            <div className="mt-4 bg-[#F3762F]/10 border border-[#F3762F] rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-[#181818] text-sm font-medium">
                <span className="inline-block mr-2">⚠️</span>
                Please set aside approximately 15-20 minutes to complete all 91 questions. Your progress cannot be saved, and you'll need to finish the test in one session.
              </p>
            </div>
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
                    key={`q${currentQuestion.id}`}
                    questionId={`q${currentQuestion.id}`}
                    questionNumber={currentQuestionIndex + 1}
                    text={currentQuestion.text}
                    giftType={currentQuestion.giftType}
                    totalQuestions={totalQuestions}
                    onAnswer={handleAnswer}
                    currentAnswer={answers[`q${currentQuestion.id}`]?.score}
                  />
                </AnimatePresence>
              )}

              <div className="mt-8 sm:mt-10 flex justify-between">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`px-5 py-3 sm:px-7 sm:py-4 rounded-xl border border-[#181818] bg-[#181818] text-gray-300 font-medium shadow-custom transition-all hover:bg-[#181818]/80 ${
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
                    className={`px-5 py-3 sm:px-7 sm:py-4 rounded-xl bg-[#F3762F] text-white font-medium shadow-md transition-all hover:bg-[#F3762F]/90 border border-[#F3762F] ${
                      !isCurrentQuestionAnswered ? 'opacity-40 cursor-not-allowed bg-[#F3762F]/50 hover:bg-[#F3762F]/50' : ''
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
                    className={`px-5 py-3 sm:px-7 sm:py-4 rounded-xl bg-[#F3762F] text-white font-medium shadow-md transition-all hover:bg-[#F3762F]/90 border border-[#F3762F] ${
                      !canComplete ? 'opacity-40 cursor-not-allowed bg-[#F3762F]/50 hover:bg-[#F3762F]/50 border-[#F3762F]/50' : ''
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
