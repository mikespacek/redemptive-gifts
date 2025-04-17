"use client";

import { motion } from 'framer-motion';
import { GiftType, giftDescriptions } from '../lib/gift-descriptions';

interface GiftSummaryProps {
  giftType: GiftType;
  isPrimary?: boolean;
}

const GiftSummary = ({ giftType, isPrimary = false }: GiftSummaryProps) => {
  const gift = giftDescriptions[giftType];
  
  return (
    <motion.div
      className="card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: isPrimary ? 0 : 0.2 }}
    >
      <div className={`p-4 ${gift.color} text-white`}>
        <div className="flex justify-between items-center">
          <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2 my-0">
            <span>{gift.emoji}</span>
            <span>{gift.name}</span>
          </h3>
          <span className="text-white bg-white/20 px-3 py-1 rounded-full text-sm">
            {isPrimary ? 'Primary Gift' : 'Secondary Gift'}
          </span>
        </div>
        <p className="text-sm sm:text-base mt-2">{gift.title}</p>
      </div>
      
      <div className="p-6">
        <p className="font-medium mb-4">{gift.summary}</p>
        
        <div className="mt-6">
          <h4 className="font-bold text-lg mb-3">Description</h4>
          <p>{gift.description}</p>
        </div>
        
        <div className="mt-6">
          <h4 className="font-bold text-lg mb-3">Strengths</h4>
          <ul className="list-disc pl-5 space-y-1">
            {gift.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>
        
        <div className="mt-6">
          <h4 className="font-bold text-lg mb-3">Challenges</h4>
          <ul className="list-disc pl-5 space-y-1">
            {gift.challenges.map((challenge, index) => (
              <li key={index}>{challenge}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default GiftSummary; 