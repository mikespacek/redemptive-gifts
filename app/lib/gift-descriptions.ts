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
  principle?: string;
  matureGift?: string;
  carnalGift?: string;
  battlefield?: string;
  legitimacyLie?: string;
  biblicalExample?: string;
  birthright?: string;
  creationDay?: string;
  tabernacleItem?: string;
}

// Import the detailed descriptions
import { detailedGiftDescriptions } from '../data/redemptiveGiftsDetailed';

export const giftDescriptions: Record<GiftType, GiftDescription> = {
  prophet: {
    name: detailedGiftDescriptions.prophet.name,
    title: detailedGiftDescriptions.prophet.title,
    summary: "Sees things in black and white (right and wrong). Committed to truth regardless if anyone agrees.",
    strengths: [
      "Takes initiative and enjoys things that are new",
      "Verbally expressive and passionate",
      "Judges and evaluates with discernment",
      "Visionary with clear goals",
      "Compulsion for honesty, integrity, and transparency"
    ],
    challenges: [
      "Judgmental and critical toward others and self",
      "Can be unforgiving and struggle to overlook failures",
      "Prone to bitterness when standards aren't met",
      "May value principles over relationships",
      "Can be non-relational and isolated"
    ],
    description: detailedGiftDescriptions.prophet.description + " " + detailedGiftDescriptions.prophet.characteristics.join(" "),
    color: "bg-red-600",
    emoji: "⚖️",
    principle: detailedGiftDescriptions.prophet.principle,
    matureGift: detailedGiftDescriptions.prophet.matureGift,
    carnalGift: detailedGiftDescriptions.prophet.carnalGift,
    battlefield: detailedGiftDescriptions.prophet.battlefield,
    legitimacyLie: detailedGiftDescriptions.prophet.legitimacyLie,
    biblicalExample: detailedGiftDescriptions.prophet.biblicalExample,
    birthright: detailedGiftDescriptions.prophet.birthright,
    creationDay: detailedGiftDescriptions.prophet.creationDay,
    tabernacleItem: detailedGiftDescriptions.prophet.tabernacleItem
  },
  servant: {
    name: detailedGiftDescriptions.servant.name,
    title: detailedGiftDescriptions.servant.title,
    summary: "Sees external needs of comfort and food and is quick to meet those needs. Is a team player.",
    strengths: [
      "Very practical and committed to meeting present needs",
      "Team player free from building own kingdom",
      "Sees the best in others",
      "Has purity of motive and can be trusted",
      "Can be in sinful environments without getting defiled"
    ],
    challenges: [
      "Difficulty saying no to competing demands",
      "Struggles with self-worth and accepting excellence",
      "Takes on others' problems and worries",
      "Enables by doing tasks instead of teaching others",
      "Attracts dishonor, especially in the home"
    ],
    description: detailedGiftDescriptions.servant.description + " " + detailedGiftDescriptions.servant.characteristics.join(" "),
    color: "bg-blue-600",
    emoji: "🙌",
    principle: detailedGiftDescriptions.servant.principle,
    matureGift: detailedGiftDescriptions.servant.matureGift,
    carnalGift: detailedGiftDescriptions.servant.carnalGift,
    battlefield: detailedGiftDescriptions.servant.battlefield,
    legitimacyLie: detailedGiftDescriptions.servant.legitimacyLie,
    biblicalExample: detailedGiftDescriptions.servant.biblicalExample,
    birthright: detailedGiftDescriptions.servant.birthright,
    creationDay: detailedGiftDescriptions.servant.creationDay,
    tabernacleItem: detailedGiftDescriptions.servant.tabernacleItem
  },
  teacher: {
    name: detailedGiftDescriptions.teacher.name,
    title: detailedGiftDescriptions.teacher.title,
    summary: "Needs to validate truth for themselves. Loves knowledge. Taps into the TRUTH of God.",
    strengths: [
      "Values precision in sharing details and first-hand information",
      "Processes and makes decisions slowly and carefully",
      "Emotionally safe person with wonderful sense of humor",
      "Deep commitment to family and tradition",
      "Listens, observes, then summarizes the whole picture"
    ],
    challenges: [
      "Passive and unwilling to impose responsibility on others",
      "Struggles with timeliness and selective responsibility",
      "Can be soft on sin and too patient with wrongdoing",
      "Wants to live by sight, not by faith",
      "May struggle with intimacy and prayer"
    ],
    description: detailedGiftDescriptions.teacher.description + " " + detailedGiftDescriptions.teacher.characteristics.join(" "),
    color: "bg-green-600",
    emoji: "📚",
    principle: detailedGiftDescriptions.teacher.principle,
    matureGift: detailedGiftDescriptions.teacher.matureGift,
    carnalGift: detailedGiftDescriptions.teacher.carnalGift,
    battlefield: detailedGiftDescriptions.teacher.battlefield,
    legitimacyLie: detailedGiftDescriptions.teacher.legitimacyLie,
    biblicalExample: detailedGiftDescriptions.teacher.biblicalExample,
    birthright: detailedGiftDescriptions.teacher.birthright,
    creationDay: detailedGiftDescriptions.teacher.creationDay,
    tabernacleItem: detailedGiftDescriptions.teacher.tabernacleItem
  },
  exhorter: {
    name: detailedGiftDescriptions.exhorter.name,
    title: detailedGiftDescriptions.exhorter.title,
    summary: "Has the ability to cross every kind of barrier and relate to people wherever they are. Intensely people-oriented.",
    strengths: [
      "Ability to share faith easily in difficult situations",
      "Big vision for reaching the world",
      "Master communicator and reconciler",
      "Not intimidated by new ideas and truth",
      "Extroverted, outgoing, and energetic"
    ],
    challenges: [
      "People pleasing and unwilling to confront due to fear of rejection",
      "Poor time management and takes on too much",
      "May settle for what is good instead of God's best",
      "Denial and avoiding responsibility for failures",
      "Can be superficial in relationships"
    ],
    description: detailedGiftDescriptions.exhorter.description + " " + detailedGiftDescriptions.exhorter.characteristics.join(" "),
    color: "bg-yellow-500",
    emoji: "🌟",
    principle: detailedGiftDescriptions.exhorter.principle,
    matureGift: detailedGiftDescriptions.exhorter.matureGift,
    carnalGift: detailedGiftDescriptions.exhorter.carnalGift,
    battlefield: detailedGiftDescriptions.exhorter.battlefield,
    legitimacyLie: detailedGiftDescriptions.exhorter.legitimacyLie,
    biblicalExample: detailedGiftDescriptions.exhorter.biblicalExample,
    birthright: detailedGiftDescriptions.exhorter.birthright,
    creationDay: detailedGiftDescriptions.exhorter.creationDay,
    tabernacleItem: detailedGiftDescriptions.exhorter.tabernacleItem
  },
  giver: {
    name: detailedGiftDescriptions.giver.name,
    title: detailedGiftDescriptions.giver.title,
    summary: "Has a generational worldview. Focused on preparing the way for family and others. Nurturing and creates family environments.",
    strengths: [
      "Very independent and stands alone",
      "Relates to a wide range of people and networks naturally",
      "Gives well and wisely, not impulsively",
      "Can birth, nurture, and protect new things and ideas",
      "Creates family environments to foster relationships"
    ],
    challenges: [
      "Too independent and may not acknowledge needs to God",
      "May appear to do right things but not deeply pursue holiness",
      "Controls based on fear of the unknown and risk",
      "Can be frugal with family members causing friction",
      "Not confrontational and avoids old problems"
    ],
    description: detailedGiftDescriptions.giver.description + " " + detailedGiftDescriptions.giver.characteristics.join(" "),
    color: "bg-purple-600",
    emoji: "🎁",
    principle: detailedGiftDescriptions.giver.principle,
    matureGift: detailedGiftDescriptions.giver.matureGift,
    carnalGift: detailedGiftDescriptions.giver.carnalGift,
    battlefield: detailedGiftDescriptions.giver.battlefield,
    legitimacyLie: detailedGiftDescriptions.giver.legitimacyLie,
    biblicalExample: detailedGiftDescriptions.giver.biblicalExample,
    birthright: detailedGiftDescriptions.giver.birthright,
    creationDay: detailedGiftDescriptions.giver.creationDay,
    tabernacleItem: detailedGiftDescriptions.giver.tabernacleItem
  },
  ruler: {
    name: detailedGiftDescriptions.ruler.name,
    title: detailedGiftDescriptions.ruler.title,
    summary: "Thrives under pressure and puts people around them under the same pressure. Skilled at time management and gets the job done.",
    strengths: [
      "Takes vision and puts together effective plans",
      "Can use imperfect people and draw the best out of them",
      "Empire-builder who makes things bigger and better",
      "Can withstand strong opposition",
      "Willing to be vindicated by God, not man"
    ],
    challenges: [
      "Insensitive and may fail to nurture those around them",
      "Can be loose on ethics when the end justifies the means",
      "May settle for their agenda instead of God's agenda",
      "Always looking for more things to do",
      "Can be task-oriented and fall short in shepherding"
    ],
    description: detailedGiftDescriptions.ruler.description + " " + detailedGiftDescriptions.ruler.characteristics.join(" "),
    color: "bg-orange-600",
    emoji: "👑",
    principle: detailedGiftDescriptions.ruler.principle,
    matureGift: detailedGiftDescriptions.ruler.matureGift,
    carnalGift: detailedGiftDescriptions.ruler.carnalGift,
    battlefield: detailedGiftDescriptions.ruler.battlefield,
    legitimacyLie: detailedGiftDescriptions.ruler.legitimacyLie,
    biblicalExample: detailedGiftDescriptions.ruler.biblicalExample,
    birthright: detailedGiftDescriptions.ruler.birthright,
    creationDay: detailedGiftDescriptions.ruler.creationDay,
    tabernacleItem: detailedGiftDescriptions.ruler.tabernacleItem
  },
  mercy: {
    name: detailedGiftDescriptions.mercy.name,
    title: detailedGiftDescriptions.mercy.title,
    summary: "Taps into the HEART of God. Gets along with everybody easily. Rarely has enemies. Is a safe person for those who are wounded.",
    strengths: [
      "Can be approached by complete strangers",
      "Hears from God through intuitive feelings",
      "Can easily enter into God's presence",
      "Has a predisposition to worship",
      "Creates safe spaces for wounded people"
    ],
    challenges: [
      "Craves intimacy which may lead to impurity",
      "Hates to confront and can become a people-pleaser",
      "May enable others by protecting them from pain",
      "Can tolerate abuse and exploitation",
      "Prone to stubbornness and emotional processing"
    ],
    description: detailedGiftDescriptions.mercy.description + " " + detailedGiftDescriptions.mercy.characteristics.join(" "),
    color: "bg-pink-600",
    emoji: "💖",
    principle: detailedGiftDescriptions.mercy.principle,
    matureGift: detailedGiftDescriptions.mercy.matureGift,
    carnalGift: detailedGiftDescriptions.mercy.carnalGift,
    battlefield: detailedGiftDescriptions.mercy.battlefield,
    legitimacyLie: detailedGiftDescriptions.mercy.legitimacyLie,
    biblicalExample: detailedGiftDescriptions.mercy.biblicalExample,
    birthright: detailedGiftDescriptions.mercy.birthright,
    creationDay: detailedGiftDescriptions.mercy.creationDay,
    tabernacleItem: detailedGiftDescriptions.mercy.tabernacleItem
  }
};