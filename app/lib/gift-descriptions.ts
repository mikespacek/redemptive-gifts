export type GiftType = 'prophet' | 'servant' | 'teacher' | 'exhorter' | 'giver' | 'ruler' | 'mercy';

export interface GiftDescription {
  name: string;
  title: string;
  summary: string;
  strengths: string[];
  challenges: string[];
  description: string;
  color: string;
  emoji: string;
}

export const giftDescriptions: Record<GiftType, GiftDescription> = {
  prophet: {
    name: "Prophet",
    title: "The Principled Revealer",
    summary: "Driven by a passion for truth and righteousness, with an ability to see issues in black and white.",
    strengths: [
      "Strong sense of justice and righteousness",
      "Ability to see root causes and core issues",
      "Boldness to speak truth even when difficult",
      "Visionary perspective",
      "Clear discernment between right and wrong"
    ],
    challenges: [
      "Can be perceived as harsh or judgmental",
      "May struggle with extending grace and mercy",
      "Can see problems more easily than solutions",
      "May have difficulty with interpersonal relationships",
      "Can focus too much on principles over people"
    ],
    description: 
      "The Prophet gift represents God's principle of authority. Prophets have a keen ability to discern between right and wrong and can quickly identify problems in situations or systems. They have a deep passion for truth, justice, and righteousness. Prophets often see life in black and white terms and are driven to speak out against compromise or corruption. They tend to be visionaries who see the big picture and can identify root issues rather than just symptoms. While prophets can be perceived as critical or harsh, their motivation is to uphold God's standards and move people toward righteousness. They function best in environments that value truth, integrity, and moral clarity.",
    color: "bg-red-600",
    emoji: "⚖️"
  },
  servant: {
    name: "Servant",
    title: "The Practical Helper",
    summary: "Finds joy in meeting practical needs with humility and compassion.",
    strengths: [
      "Natural ability to see and meet practical needs",
      "Finds joy in serving others",
      "Humble and selfless",
      "Detail-oriented and thorough",
      "Patient and loyal"
    ],
    challenges: [
      "May neglect personal needs and boundaries",
      "Can struggle to receive help from others",
      "May enable unhealthy dependencies",
      "Can become resentful if taken advantage of",
      "May struggle with saying no"
    ],
    description: 
      "The Servant gift reflects God's principle of authority through service. Those with this gift find genuine joy in meeting practical needs and serving behind the scenes without recognition. They are naturally observant of physical needs and quick to respond with practical help. Servants are humble, loyal, and often detail-oriented. They show love through actions rather than words and gain fulfillment from making others' lives easier. While servants excel at meeting practical needs, they may struggle with setting healthy boundaries or receiving help from others. They thrive in environments where practical service is valued and appreciated.",
    color: "bg-blue-600",
    emoji: "🙌"
  },
  teacher: {
    name: "Teacher",
    title: "The Diligent Researcher",
    summary: "Driven by a love of truth and accuracy, with a gift for systematic learning and communicating.",
    strengths: [
      "Strong attention to detail and accuracy",
      "Logical and systematic thinking",
      "Patient and thorough in research",
      "Ability to organize and present information clearly",
      "Values truth and precision"
    ],
    challenges: [
      "May prioritize facts over relationships",
      "Can be perceived as overly critical or nitpicky",
      "May struggle with analysis paralysis",
      "Can focus too much on information rather than application",
      "May appear detached or unemotional"
    ],
    description: 
      "The Teacher gift embodies God's principle of authority through knowledge and truth. Teachers have a deep love for accurate information and are driven to research thoroughly before drawing conclusions. They naturally think in logical, systematic ways and value precision in communication. Teachers enjoy validating information and correcting misinformation. They tend to be detail-oriented, analytical, and methodical in their approach to learning and problem-solving. While teachers excel at acquiring and organizing knowledge, they may need to balance their focus on facts with relational warmth. They thrive in environments that value accuracy, depth, and systematic approaches.",
    color: "bg-green-600",
    emoji: "📚"
  },
  exhorter: {
    name: "Exhorter",
    title: "The Encouraging Motivator",
    summary: "Naturally sees potential and possibilities, with a gift for encouraging others to grow.",
    strengths: [
      "Natural encourager and motivator",
      "Ability to see potential in people and situations",
      "Practical problem-solver",
      "Relationally skilled and approachable",
      "Positive and hopeful perspective"
    ],
    challenges: [
      "May give simplistic solutions to complex problems",
      "Can struggle with depth and follow-through",
      "May avoid necessary confrontation",
      "Can prioritize positivity over hard truths",
      "May struggle with setting boundaries in relationships"
    ],
    description: 
      "The Exhorter gift reflects God's principle of authority through encouragement and motivation. Exhorters naturally see potential and possibilities where others see problems. They have a gift for encouraging others and bringing out the best in them. Exhorters are relationally oriented, approachable, and tend to be positive and enthusiastic. They are practical problem-solvers who focus on application rather than just theory. Exhorters connect easily with others and are skilled at making abstract concepts practical and relevant. While exhorters excel at motivation and encouragement, they may need to develop depth and follow-through. They thrive in environments that value relationship, personal growth, and positive transformation.",
    color: "bg-yellow-500",
    emoji: "🌟"
  },
  giver: {
    name: "Giver",
    title: "The Strategic Steward",
    summary: "Skilled at acquiring and distributing resources with wisdom and generosity.",
    strengths: [
      "Wise stewardship of resources",
      "Strategic thinking and planning",
      "Ability to see value and potential",
      "Generosity with purpose",
      "Prudent decision-making"
    ],
    challenges: [
      "May struggle with control issues around resources",
      "Can appear materialistic or overly focused on finances",
      "May judge others based on their stewardship",
      "Can have difficulty being spontaneously generous",
      "May struggle with trusting God completely with resources"
    ],
    description: 
      "The Giver gift embodies God's principle of authority through stewardship and provision. Givers have an innate ability to acquire, manage, and distribute resources with wisdom and strategy. They are naturally able to recognize value and potential in people, opportunities, and material resources. Givers tend to be careful planners who think long-term and are skilled at making wise financial decisions. While they can be very generous, their giving is typically strategic and purposeful rather than impulsive. Givers often desire to multiply the effectiveness of their resources and gifts. They thrive in environments that value wise stewardship, strategic planning, and purposeful generosity.",
    color: "bg-purple-600",
    emoji: "🎁"
  },
  ruler: {
    name: "Ruler",
    title: "The Visionary Builder",
    summary: "Natural at organizing people and resources to accomplish a vision or goal.",
    strengths: [
      "Strong organizational and leadership abilities",
      "Visionary and goal-oriented",
      "Practical problem-solver and implementer",
      "Persistent through challenges",
      "Ability to see the big picture"
    ],
    challenges: [
      "May value results over relationships",
      "Can be perceived as controlling or domineering",
      "May struggle with delegating or trusting others",
      "Can become workaholics",
      "May become frustrated with slower-paced people"
    ],
    description: 
      "The Ruler gift represents God's principle of authority through leadership and implementation. Rulers have a natural ability to organize people and resources toward accomplishing a vision or goal. They are practical visionaries who excel at turning ideas into reality through projects and systems. Rulers tend to be persistent, decisive, and goal-oriented. They naturally see the big picture while also understanding the practical steps needed to achieve objectives. While rulers excel at leadership and implementation, they may need to balance their focus on tasks with relational sensitivity. They thrive in environments that value efficiency, productivity, and clear vision.",
    color: "bg-orange-600",
    emoji: "👑"
  },
  mercy: {
    name: "Mercy",
    title: "The Compassionate Harmonizer",
    summary: "Naturally senses emotional needs and brings comfort, peace, and beauty.",
    strengths: [
      "Deep empathy and emotional awareness",
      "Ability to bring comfort and healing",
      "Natural peacemaker",
      "Appreciation for beauty and harmony",
      "Patient and accepting of others"
    ],
    challenges: [
      "May absorb others' emotions to unhealthy degrees",
      "Can avoid necessary conflict",
      "May enable unhealthy behaviors",
      "Can struggle with setting boundaries",
      "May have difficulty with objective decision-making"
    ],
    description: 
      "The Mercy gift reflects God's principle of authority through compassion and empathy. Those with this gift have a natural ability to sense emotions and bring comfort to others. They are deeply empathetic and intuitive about emotional needs and atmospheres. Mercy-gifted individuals value harmony, beauty, and peace in their environments and relationships. They are patient, accepting, and naturally forgiving. Mercy gifts often create warm, nurturing spaces where others feel safe and valued. While they excel at emotional sensitivity and compassion, they may need to develop healthy boundaries. They thrive in environments that value emotional authenticity, harmony, and compassionate care.",
    color: "bg-pink-600",
    emoji: "💖"
  }
}; 