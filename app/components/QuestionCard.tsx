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
        <span className="text-sm font-medium text-white bg-[#181818] px-4 py-1.5 rounded-full">
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>

      <h3 className="text-lg md:text-xl font-medium mb-8 leading-relaxed text-gray-800">{text}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 4, 5].map((score) => (
          <button
            key={score}
            onClick={() => handleSelect(score)}
            className={`flex flex-col items-center p-4 sm:p-5 rounded-xl transition-all ${
              selectedScore === score
                ? 'bg-[#F3762F]/10 border-2 border-[#F3762F] shadow-md'
                : 'bg-white border border-gray-200 hover:border-[#F3762F] hover:bg-gray-50'
            }`}
          >
            <span className={`text-lg sm:text-xl font-bold mb-1 sm:mb-2 ${selectedScore === score ? 'text-[#F3762F]' : 'text-gray-600'}`}>{score}</span>
            <span className={`text-xs text-center ${selectedScore === score ? 'text-[#181818]' : 'text-gray-500'}`}>
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
      return 'NEVER';
    case 2:
      return 'SOMETIMES';
    case 4:
      return 'MOSTLY';
    case 5:
      return 'ALWAYS';
    default:
      return '';
  }
}

export default QuestionCard;