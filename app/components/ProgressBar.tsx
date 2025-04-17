"use client";

import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
}

const ProgressBar = ({ currentQuestion, totalQuestions }: ProgressBarProps) => {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-400">
          Question {currentQuestion} of {totalQuestions}
        </span>
        <span className="text-sm font-medium text-white bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
          {Math.round(progress)}% complete
        </span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden shadow-inner border border-gray-700">
        <motion.div
          className="h-3 rounded-full bg-gradient-to-r from-gray-600 to-gray-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: 0.3,
            ease: "easeOut"
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;