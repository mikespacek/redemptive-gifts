"use client";

import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
}

const ProgressBar = ({ currentQuestion, totalQuestions }: ProgressBarProps) => {
  const progress = (currentQuestion / totalQuestions) * 100;
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
      <motion.div 
        className="h-2.5 rounded-full bg-indigo-600"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ 
          duration: 0.3,
          ease: "easeOut" 
        }}
      />
    </div>
  );
};

export default ProgressBar; 