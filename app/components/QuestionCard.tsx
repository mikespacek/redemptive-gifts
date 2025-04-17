"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  questionId: string;
  questionNumber: number;
  text: string;
  giftType: string;
  totalQuestions: number;
  onAnswer: (questionId: string, giftType: string, score: number) => void;
  currentAnswer?: number | null;
  autoAdvance?: boolean;
}

const QuestionCard = ({
  questionId,
  questionNumber,
  text,
  giftType,
  totalQuestions,
  onAnswer,
  currentAnswer,
  autoAdvance = true
}: QuestionCardProps) => {
  const [selectedScore, setSelectedScore] = useState<number | null>(currentAnswer || null);

  const handleSelect = (score: number) => {
    setSelectedScore(score);

    // Call the onAnswer callback with an additional autoAdvance parameter
    // This will signal to the parent component that it should advance to the next question
    onAnswer(questionId, giftType, score);
  };

  return (
    <motion.div
      className="p-6 md:p-8 shadow-lg rounded-2xl bg-white border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-5">
        <span className="text-sm font-medium text-gray-700 bg-gray-100 px-4 py-1.5 rounded-full border border-gray-200">
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>

      <h3 className="text-lg md:text-xl font-medium mb-8 leading-relaxed text-gray-800">{text}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            onClick={() => handleSelect(score)}
            className={`flex flex-col items-center p-4 sm:p-5 rounded-xl transition-all ${
              selectedScore === score
                ? 'bg-gray-100 border-2 border-gray-400 shadow-md'
                : 'bg-white border border-gray-200 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <span className={`text-lg sm:text-xl font-bold mb-1 sm:mb-2 ${selectedScore === score ? 'text-gray-800' : 'text-gray-600'}`}>{score}</span>
            <span className={`text-xs text-center ${selectedScore === score ? 'text-gray-700' : 'text-gray-500'}`}>
              {getScoreLabel(score)}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

// Helper function to get label for score
function getScoreLabel(score: number): string {
  switch (score) {
    case 1:
      return 'Strongly Disagree';
    case 2:
      return 'Disagree';
    case 3:
      return 'Neutral';
    case 4:
      return 'Agree';
    case 5:
      return 'Strongly Agree';
    default:
      return '';
  }
}

export default QuestionCard;