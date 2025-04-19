"use client";

import { motion } from 'framer-motion';

interface MissedQuestionsAlertProps {
  missedQuestions: number[];
  onClose: () => void;
  onGoToQuestion: (questionId: number) => void;
}

export default function MissedQuestionsAlert({ 
  missedQuestions, 
  onClose, 
  onGoToQuestion 
}: MissedQuestionsAlertProps) {
  // Sort the missed questions numerically
  const sortedMissedQuestions = [...missedQuestions].sort((a, b) => a - b);
  
  // Group consecutive questions for better display
  const groupedQuestions: { start: number; end: number }[] = [];
  
  if (sortedMissedQuestions.length > 0) {
    let currentGroup = { start: sortedMissedQuestions[0], end: sortedMissedQuestions[0] };
    
    for (let i = 1; i < sortedMissedQuestions.length; i++) {
      const current = sortedMissedQuestions[i];
      const previous = sortedMissedQuestions[i - 1];
      
      if (current === previous + 1) {
        // Consecutive question, extend the current group
        currentGroup.end = current;
      } else {
        // Non-consecutive, add the current group and start a new one
        groupedQuestions.push(currentGroup);
        currentGroup = { start: current, end: current };
      }
    }
    
    // Add the last group
    groupedQuestions.push(currentGroup);
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    >
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Missed Questions</h3>
          <p className="text-gray-600">
            You have {missedQuestions.length} unanswered {missedQuestions.length === 1 ? 'question' : 'questions'}. 
            Please answer all questions before completing the test.
          </p>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-2">Unanswered Questions:</h4>
          <div className="max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-lg">
            <ul className="space-y-2">
              {groupedQuestions.map((group, index) => (
                <li key={index} className="flex items-center">
                  <button
                    onClick={() => onGoToQuestion(group.start)}
                    className="text-left flex-1 py-1 px-2 hover:bg-gray-100 rounded text-[#F3762F] hover:text-[#F3762F]/80 font-medium"
                  >
                    {group.start === group.end ? (
                      <>Question {group.start}</>
                    ) : (
                      <>Questions {group.start} - {group.end}</>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onGoToQuestion(sortedMissedQuestions[0])}
            className="px-4 py-2 bg-[#F3762F] text-white rounded-lg hover:bg-[#F3762F]/90"
          >
            Go to First Missed Question
          </button>
        </div>
      </div>
    </motion.div>
  );
}
