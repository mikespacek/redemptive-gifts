/**
 * Detailed descriptions of the seven redemptive gifts based on Romans 12:6-8
 */

import { GiftType } from '../lib/gift-descriptions';

export interface DetailedGiftDescription {
  name: string;
  title: string;
  principle: string;
  description: string;
  characteristics: string[];
  weaknesses: string[];
  matureGift: string;
  carnalGift: string;
  battlefield: string;
  legitimacyLie: string;
  biblicalExample: string;
  birthright: string;
  creationDay: string;
  tabernacleItem: string;
}

export const detailedGiftDescriptions: Record<GiftType, DetailedGiftDescription> = {
  prophet: {
    name: "Prophet",
    title: "The Perceiver",
    principle: "Principle of Design",
    description: "Sees things in black and white (right and wrong). Committed to truth regardless if anyone agrees. Taps into the MIND of God.",
    characteristics: [
      "Takes initiative and enjoys things that are new. Not good at maintaining things.",
      "Verbally expressive and can be compulsive about it.",
      "Judges and evaluates everything, even situations that do not directly impact them.",
      "Needs to have a goal, a reason to live, and an objective.",
      "Tends to be a visionary.",
      "Has a compulsion for honesty, integrity, and transparency.",
      "Is intolerant of perceived rebellion, hypocrisy, and denial, especially in leadership.",
      "Has a large range of emotions. Intense, passionate extremes.",
      "Can embrace a problem and figure out how to repair it. Can re-build, not just criticize.",
      "Needs time to refuel and re-energize and process.",
      "Isn't designed to meet people's needs.",
      "Easier for prophet to condemn than to help correct with love and patience.",
      "The prophet goes through more difficult times than other gifts in order to purify and sanctify the heart. Higher level of sacrifice will be required."
    ],
    weaknesses: [
      "Judgmental. Critical toward others and even more of themselves.",
      "Unforgiving. Not willing to overlook the failures and weaknesses of others.",
      "Bitterness. Enduring battlefield for the prophet. Can have an unforgiving spirit that is destructive.",
      "Non-relational. Tends to value principles and truth as more important than relationships."
    ],
    matureGift: "Confronts sin boldly, \"let there be light\", embraces sonship, and eradicates the \"orphaned heart\" thinking. Trailblazers! Passion for excellence and restoration. Has learned to endure.",
    carnalGift: "Over reacts, isolated, withdrawn, hopeless, and wounded. Focuses on problems around them. Quits relationships. Negative.",
    battlefield: "Fractured relationships",
    legitimacyLie: "I can solve my own problems better than God.",
    biblicalExample: "Peter - Acts 5:29-42. Also Enoch, Elijah, Ezekial, Caleb, James (brother of Christ), Naomi & Miriam",
    birthright: "To help others obtain their birthright and destiny; to rebuild and restore",
    creationDay: "Day 1 - Separation of light from the dark; Spoke the word to bring order and structure (Power of the Word)",
    tabernacleItem: "Brazen Altar deals with sin. Prophet stands for righteousness"
  },
  servant: {
    name: "Servant",
    title: "The Helper",
    principle: "Principle of Authority",
    description: "Sees external needs of comfort and food and is quick to meet those needs. Is a team player and relatively free from the desire to build their own kingdom.",
    characteristics: [
      "Is very practical. Is committed to the present moment to meet present needs.",
      "Has difficulty saying \"no\" to competing demands. Usually overcommitted in scheduling.",
      "Finds it hard to accept excellence in their work, to affirm themselves, or to receive affirmation from others.",
      "Tends to find something to apologize for when serving others.",
      "Sees the best in others.",
      "Attracts dishonor, especially in the home. Tends to be the one who is talked down to and has jokes made about them.",
      "Is competitive in areas that are considered safe to the servant, such as games or children's sports teams.",
      "Otherwise dedicated to seeing others succeed more than themselves.",
      "Has purity of motive. Is straightforward, honest, and can be trusted.",
      "Can be in a sinful environment without getting personally defiled.",
      "Low maintenance, doesn't strive."
    ],
    weaknesses: [
      "Battle for self-worth. Doesn't see their innate value and doesn't believe God's truth about themselves or their call.",
      "Worry/anxiety. Takes on other people's problems and worries about it.",
      "Enabling. Does a task instead of teaching others to do it and releasing it."
    ],
    matureGift: "God pleaser, not man pleaser. God can trust the servant with unparalleled spiritual authority. Walks in true humility, no guile, free to admit mistakes.",
    carnalGift: "Poor self-image, over commits, walks in poverty spirit. Thinks in self-defeating terms. Shame – performance oriented.",
    battlefield: "Mindset of victimization, feeling like a victim rather than a victor.",
    legitimacyLie: "I am legitimate when I build a platform of success under others.",
    biblicalExample: "Esther - Esther 8-9. Also Joseph (husband of Mary), Barnabus, Timothy & Ananias (ministered to Paul)",
    birthright: "To wear a crown of life, bringing life to broken families, leaders and defiled land",
    creationDay: "Day 2 - (Atmosphere, air) Ability to cleanse impurities from atmosphere; oxygen is crucial to sustain life. \"Clears the air\"",
    tabernacleItem: "Bronze laver used for cleansing; facilitates transition into throne room"
  },
  teacher: {
    name: "Teacher",
    title: "The Researcher",
    principle: "Principle of Responsibility",
    description: "Needs to validate truth for themselves. Loves knowledge. Taps into the TRUTH of God.",
    characteristics: [
      "Wants first-hand details. Values precision in sharing details. Usually articulate, good at writing.",
      "Processes and makes decisions slowly. Can slow down impulsive people who jump to conclusions.",
      "Is a very safe person emotionally and is sometimes confused with the gift of mercy.",
      "The difference is the teacher tends to be led in their head and mercy to be led by their heart.",
      "May think that knowledge can \"save\"",
      "Has a deep commitment to family and tradition.",
      "Values reason, accuracy, balance; loyalty important",
      "Seen as safe because they are patient with those in sin.",
      "Has a wonderful sense of humor.",
      "Tends to be the last one to speak in a group. Will listen and observe, then summarize the whole picture.",
      "Tends to feed their mind, more than their spirit.",
      "Tends toward selective responsibility. Can be extremely responsible and reliable in one area, but does not carry that same behavior over to other areas."
    ],
    weaknesses: [
      "Passive. Unwilling to impose responsibility on others. Can be soft on sin and too patient with people who are doing wrong.",
      "Struggles with issues of timeliness and responsibility in selective areas. Procrastinates on practical things.",
      "Can be soft on sin and doesn't like to ask others for help.",
      "Wants to live by sight, not by faith.",
      "Intimacy and prayer may be a major battle for the teacher.",
      "Poor boundaries, doesn't plan for future.",
      "Can be immobilized by fear or risk."
    ],
    matureGift: "Relationship with truth, ability to access hidden manna in the word of God. Walks in healthy loyalty. Releases truth that empowers and equips.",
    carnalGift: "Accepts what has been documented, ritual, stays stuck in \"old wine.\" Arrogant in knowledge. Unhealthy loyalty, perverted by enemy to keep them in toxic relationships.",
    battlefield: "Selective responsibility",
    legitimacyLie: "I know I have the truth and it gives me power. I am right and have complete and accurate information.",
    biblicalExample: "Luke - Luke chapters 1-5. Also Daniel, Isaiah, Levi, Samuel",
    birthright: "To know God's deep truths and to experience Him",
    creationDay: "Day 3 - (Separation of sea from dry land; plants and animals) Draws nutrients out of God's Word",
    tabernacleItem: "Table of Showbread; Jesus is the True Bread of Life, Word Incarnate"
  },
  exhorter: {
    name: "Exhorter",
    title: "The Encourager",
    principle: "Principle of Sowing and Reaping",
    description: "Has the ability to cross every kind of barrier (social, racial, economic, religious) and relate to people wherever they are. Is horizontal in focus and intensely people-oriented.",
    characteristics: [
      "Has the ability to share their faith easily and in difficult situations",
      "Has a big vision for reaching the world.",
      "Enjoys being around people. Is extroverted, outgoing, a party looking for someplace to happen.",
      "Is a master communicator.",
      "Is not intimidated by new ideas and new truth.",
      "Is a visionary. Tends to see a broader picture.",
      "Is a master of reconciliation.",
      "Works hard and is intensely busy. Functions on little sleep. Is involved in many projects."
    ],
    weaknesses: [
      "People pleasing. Unwilling to confront because of fear of rejection.",
      "Poor time management. Tends to take on too much.",
      "Compromise. May settle for doing what is good, instead of God's best."
    ],
    matureGift: "Mobilizes, influences, and inspires people to reach their full potential in God. God pleaser. Life giving relationships, earned authority in persevering and for embracing pain.",
    carnalGift: "Uses influence to achieve their personal agenda & goals. Unwilling to embrace pain and has self-serving relationships. Unwilling to address sin in the camp because of rejection. Can be superficial.",
    battlefield: "Denial, accepting responsibility for their own failures.",
    legitimacyLie: "I am legitimate when people want & need to be around me.",
    biblicalExample: "Paul - 2 Cor. 10:15-16, 8:16-18. Also Moses, Jeremiah, Solomon",
    birthright: "To reveal God to others",
    creationDay: "Day 4 - (Sun, moon, stars; the shiny stuff!) Domain over time",
    tabernacleItem: "Candlestick sheds light. Oil needed to be pure."
  },
  giver: {
    name: "Giver",
    title: "The Provider",
    principle: "Principle of Stewardship",
    description: "Has a generational worldview. Is focused on trying to prepare the way for their family and others after them. Is nurturing and creates a family environment to foster relationships.",
    characteristics: [
      "Is very independent. Stands alone. Does not look to other people for help and sometimes not even to God.",
      "Resists being conned, manipulated, or guilt-tripped into action. Tendency to feel manipulated when others withhold information from them.",
      "Is able to relate to a wide range of people. Natural networker.",
      "Gives well and wisely, not impulsively.",
      "Detects problems in themselves but not others.",
      "Tends to be frugal with family members, which can cause friction.",
      "Desires to keep life private.",
      "Not confrontational by nature. Doesn't like to deal with old problems.",
      "Tends to find bargains, good deals, or discounts before making purchases.",
      "May tend to see money as a source of security.",
      "Can birth, nurture, and protect new things and new ideas. New things arise and grow at a greater pace than other gifts."
    ],
    weaknesses: [
      "Independence. Does not need others. May not acknowledge needs to God.",
      "Hypocrisy. May appear to do the right things, but may not deeply pursue holiness.",
      "Control and manipulation. Desires to control based on fear of the unknown and risk. Tries to manipulate God and people."
    ],
    matureGift: "Trusts God; sees themselves as a conduit of blessings. Builds, provides for future, balanced generosity. Takes financial risk based on faith. Stands against destructive forces of excess and indulgence.",
    carnalGift: "Too frugal, puts trust in money/possessions. Shallow relationships, overly cautious. Decisions based on fear, not faith.",
    battlefield: "Wants to stand alone, independent of others",
    legitimacyLie: "I am legitimate when others need me (I can provide for them).",
    biblicalExample: "Job - Job 16:20-21. Also Abraham, Jacob, Matthew",
    birthright: "To release life-giving generational blessings",
    creationDay: "Day 5 - (Birds, fish...) What was birthed was multiplied; called to reproduce",
    tabernacleItem: "Altar of incense - worship and intercession flowing from relationship. Inspires gratitude"
  },
  ruler: {
    name: "Ruler",
    title: "The Leader",
    principle: "Principle of Freedom",
    description: "Thrives under pressure and puts the people around them under the same pressure. Can be motivational or abusive. Is skilled at time management and gets the job done.",
    characteristics: [
      "Can be loose on ethics when the end justifies the means.",
      "Can use imperfect people and draw the best out of them without allowing their brokenness to damage the goal of a project or group.",
      "Takes a vision and puts together an effective plan. Is an implementer, not necessarily a visionary.",
      "Is an empire-builder. Wants to make anything bigger and better.",
      "Focuses on the immediate task.",
      "Can be task-oriented and fall short in nurturing, shepherding, and correcting what is spiritually wrong.",
      "Is willing to be vindicated by God, and not man.",
      "Can withstand strong opposition."
    ],
    weaknesses: [
      "Insensitivity. Since they are goal-oriented, they may fail to nurture those around them and may apply pressure without moderation.",
      "Ethics and integrity. The end justifies the means.",
      "Compromise. Settling for their agenda instead of God's agenda.",
      "Always looking for more things to do."
    ],
    matureGift: "High moral integrity, shares authority & leadership with others. Life giving; Doesn't push people beyond their limits; Nurtures.",
    carnalGift: "Leads or governs by control, Applies constant pressure at work/home/ministry. Can't receive correction/they are right. Too busy with multiple interests. Self-reliant. (Great commission becomes greater than Great commandment)",
    battlefield: "Exploitation = Use (a situation or person) in an unfair or selfish way. Overwork or underpay.",
    legitimacyLie: "I am successful when I have authority over others",
    biblicalExample: "Nehemiah - Neh. 1:11, chapter 2. Also Noah, Boaz, Joseph (son of Jacob)",
    birthright: "To go beyond obedience and honor God, live in freedom and holiness.",
    creationDay: "Day 6 - (Animals, bugs, MAN) Dominion over the earth.",
    tabernacleItem: "Ark of the Covenant. True leadership is submitted to God's law."
  },
  mercy: {
    name: "Mercy",
    title: "The Compassionate",
    principle: "Principle of Fulfillment",
    description: "Taps into the HEART of God. Gets along with everybody easily. Rarely has enemies. Is a safe person for those who are wounded. Can be approached by complete strangers.",
    characteristics: [
      "Craves intimacy of soul and physical touch; vulnerable to physical needs.",
      "Tends to be slow to make transitions based on emotional processing.",
      "Hears from God but has difficulty explaining the \"why.\" Operates on subjective and intuitive feelings.",
      "Hates to confront.",
      "Can become a people-pleaser and enabler.",
      "May attract abuse and exploitation because of their kindness, niceness, and willingness to allow injustice to happen.",
      "Prone to stubbornness.",
      "Can easily enter into the presence of God. Has a predisposition to worship."
    ],
    weaknesses: [
      "Impurity. Desire for intimacy and physical touch may lead to impurity.",
      "Enabling. Wants to protect others from pain.",
      "Compromise. Willing to live with mixture of holy and unholy without calling people to do what is right.",
      "Non-confrontational. May tolerate abuse and exploitation because they are willing to allow injustice to continue."
    ],
    matureGift: "God pleasing, free from fear of man. Knows the heart of God. True empathy. Observes appropriate boundaries. Sanctifies the environment with a pure presence.",
    carnalGift: "Flees pain & the discipline of God. Embraces dangerous people. Man pleasers. Inappropriate intimacy. Motivated by fear and feelings. Can overreact from insecurity.",
    battlefield: "Stubbornness, futility (seeing no results)",
    legitimacyLie: "When I have earned God's or people's favor through self-sacrifice.",
    biblicalExample: "John - 1 John 1:3, 2:24. Also Adam, David, Ruth",
    birthright: "To release holiness and the glory of God resting in His presence.",
    creationDay: "Day 7 - REST, just being a reflection of Him, apart from striving.",
    tabernacleItem: "Mercy Seat representing where the glory of The Lord resides."
  }
};
