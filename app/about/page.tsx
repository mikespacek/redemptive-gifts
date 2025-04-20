"use client";

import { motion } from 'framer-motion';
import PageLayout from '../components/PageLayout';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-12 max-w-6xl">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-white">About Your Design</h1>

            <div className="mt-8">
              <h2>What are Redemptive Gifts?</h2>
              <p>
                The concept of Redemptive Gifts is based on Romans 12:6-8, which describes seven
                spiritual gifts: prophecy, serving, teaching, exhortation, giving, leadership, and mercy.
                Arthur Burk has expanded on this biblical foundation to provide deep insights into how
                these gifts shape human personality, motivation, and purpose.
              </p>
              <p>
                Each person is believed to have one dominant gift that shapes their core view of the
                world, along with secondary gifts that influence them to lesser degrees. These gifts
                reflect different aspects of God's nature and provide insight into how we are designed
                to function in the world.
              </p>
            </div>

            <div className="mt-8">
              <h2>The Seven Redemptive Gifts</h2>

              <div className="mt-4 space-y-6">
                <div className="card">
                  <h3 className="text-[#F3762F]">Prophet</h3>
                  <p>
                    The Prophet gift represents God's principle of authority. Prophets have a keen ability
                    to discern between right and wrong and can quickly identify problems in systems,
                    situations, or people. They have a deep passion for truth, justice, and righteousness.
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-[#F3762F]">Servant</h3>
                  <p>
                    The Servant gift reflects God's principle of authority through service. Those with
                    this gift find genuine joy in meeting practical needs, often working behind the scenes
                    without recognition. They are naturally observant of physical needs and quick to
                    respond with practical help.
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-[#F3762F]">Teacher</h3>
                  <p>
                    The Teacher gift embodies God's principle of authority through knowledge and truth.
                    Teachers have a deep love for accurate information and are driven to research thoroughly
                    before drawing conclusions. They naturally think in logical, systematic ways and value
                    precision in communication.
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-[#F3762F]">Exhorter</h3>
                  <p>
                    The Exhorter gift reflects God's principle of authority through encouragement and
                    motivation. Exhorters naturally see potential and possibilities where others see problems.
                    They have a gift for encouraging others and bringing out the best in them.
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-[#F3762F]">Giver</h3>
                  <p>
                    The Giver gift embodies God's principle of authority through stewardship and provision.
                    Givers have an innate ability to acquire, manage, and distribute resources with wisdom
                    and strategy. They are naturally able to recognize value and potential in resources,
                    opportunities, and people.
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-[#F3762F]">Ruler</h3>
                  <p>
                    The Ruler gift represents God's principle of authority through leadership and
                    implementation. Rulers have a natural ability to organize people and resources toward
                    accomplishing a vision or goal. They are practical visionaries who excel at turning
                    ideas into reality.
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-[#F3762F]">Mercy</h3>
                  <p>
                    The Mercy gift reflects God's principle of authority through compassion and empathy.
                    Those with this gift have a natural ability to sense emotions and bring comfort to others.
                    They are deeply empathetic and intuitive about emotional needs and atmospheres.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2>About This Test</h2>
              <p>
                This assessment is designed to help you identify your primary and secondary redemptive
                gifts. The questions are crafted to reveal your natural tendencies, strengths, and
                challenges. While no test is perfect, this tool can provide valuable insight into your
                design and purpose.
              </p>
              <p>
                The test consists of 91 questions that you'll rate on a scale from 1 (NEVER) to 2 (SOMETIMES)
                to 4 (MOSTLY) to 5 (ALWAYS). Your honest responses will produce the most accurate results.
              </p>
              <p>
                <strong>Important:</strong> Please note that you must complete the test in one session as your progress
                cannot be saved. The test typically takes about 15-20 minutes to complete.
              </p>
            </div>

            <div className="mt-8 text-center">
              <Link href="/test" className="btn-secondary">
                Take the Test
              </Link>
            </div>

            <div className="mt-16 text-sm text-gray-500">
              <p>
                Note: This test is designed for personal insight and spiritual growth.
                It is not a scientific or psychological assessment. The results are meant to help you
                understand your unique design and how you can best serve in your community and relationships.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}