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
}

const QuestionCard = ({
  questionId,
  questionNumber,
  text,
  giftType,
  totalQuestions,
  onAnswer,
  currentAnswer
}: QuestionCardProps) => {
  const [selectedScore, setSelectedScore] = useState<number | null>(currentAnswer || null);

  const handleSelect = (score: number) => {
    setSelectedScore(score);
    onAnswer(questionId, giftType, score);
  };

  return (
    <motion.div
      className="card p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-500">Question {questionNumber} of {totalQuestions}</span>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
          {giftType.charAt(0).toUpperCase() + giftType.slice(1)}
        </span>
      </div>

      <h3 className="text-lg md:text-xl font-medium mb-6">{text}</h3>

      <div className="space-y-4 md:space-y-0 md:flex md:justify-between md:space-x-2 lg:space-x-4">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            onClick={() => handleSelect(score)}
            className={`w-full md:w-auto flex flex-col items-center p-4 rounded-lg border transition-all ${
              selectedScore === score
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
            }`}
          >
            <span className="text-xl font-bold mb-2">{score}</span>
            <span className="text-xs text-center text-gray-500">
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