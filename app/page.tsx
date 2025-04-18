"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import PageLayout from './components/PageLayout';
import { GiftType, giftDescriptions } from './lib/gift-descriptions';

export default function Home() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-[#181818] text-white">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-12 md:py-20 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Discover Your Design
            </motion.h1>

            <motion.p
              className="mt-6 text-lg md:text-xl text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              This test helps you identify your dominant spiritual design and understand
              how you're uniquely created to impact the world.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10"
            >
              <a
                href="/test"
                style={{
                  backgroundColor: '#F3762F',
                  color: '#FFFFFF',
                  padding: '12px 32px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  display: 'inline-block',
                  textDecoration: 'none',
                  border: 'none'
                }}
              >
                Start Test
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-[#181818]">What Are Spiritual Gifts?</h2>
          <p className="mt-4 text-lg text-center text-gray-700 max-w-3xl mx-auto">
            Spiritual gifts are based on Romans 12:6-8 and describe seven gift types that
            reflect different aspects of God's nature. These gifts influence how you see the world,
            process information, and interact with others.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Object.keys(giftDescriptions) as GiftType[]).map((gift, index) => (
              <motion.div
                key={gift}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="bg-[#181818] p-4 text-white">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span>{giftDescriptions[gift].emoji}</span>
                    <span>{giftDescriptions[gift].name}</span>
                  </h3>
                  <p className="text-sm mt-1">{giftDescriptions[gift].title}</p>
                </div>
                <div className="p-4">
                  <p>{giftDescriptions[gift].summary}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-[#181818] text-white">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-white">How It Works</h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-[#F3762F] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">Take the Test</h3>
              <p className="mt-2 text-gray-300">
                Complete 91 questions using a scoring system of 1, 2, 4, or 5 to identify your spiritual gifts.
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-[#F3762F] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">Get Your Results</h3>
              <p className="mt-2 text-gray-300">
                Receive a detailed analysis showing your dominant and secondary gifts.
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="w-16 h-16 bg-[#F3762F] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">Gain Insight</h3>
              <p className="mt-2 text-gray-300">
                Learn about your unique strengths, challenges, and how to leverage your gifts.
              </p>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <a
              href="/test"
              style={{
                backgroundColor: '#F3762F',
                color: '#FFFFFF',
                padding: '12px 32px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '18px',
                display: 'inline-block',
                textDecoration: 'none',
                border: 'none'
              }}
            >
              Begin Your Journey
            </a>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
