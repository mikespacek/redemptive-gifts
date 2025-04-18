// Redemptive Gifts Questions
// Based on the Redemptive Gifts Questionnaire

export type GiftType = 'prophet' | 'servant' | 'teacher' | 'exhorter' | 'giver' | 'ruler' | 'mercy';

export interface Question {
  id: number;
  text: string;
  giftType: GiftType;
}

export const giftTypeMapping: Record<number, GiftType> = {
  1: 'teacher',
  2: 'giver',
  3: 'ruler',
  4: 'exhorter',
  5: 'mercy',
  6: 'prophet',
  7: 'servant',
};

export const questions: Question[] = [
  // Questions in the exact order from the images
  { id: 1, text: "Present truth in a logical, systematic way", giftType: 'teacher' },
  { id: 2, text: "Makes provision for future generations (e.g. children, grandchildren, etc.)", giftType: 'giver' },
  { id: 3, text: "Are highly motivated to organise and implement plans", giftType: 'ruler' },
  { id: 4, text: "Capable of having significant disagreements without offence", giftType: 'exhorter' },
  { id: 5, text: "Have tremendous capacity to show love", giftType: 'mercy' },
  { id: 6, text: "Quickly and accurately identifies right", giftType: 'prophet' },
  { id: 7, text: "Recognise practical needs and is quick to meet them", giftType: 'servant' },
  { id: 8, text: "Validate truth by weighing it against the facts", giftType: 'teacher' },
  { id: 9, text: "Are able to accommodate people with diverse viewpoints", giftType: 'giver' },
  { id: 10, text: "Prefer to be under authority in order to have authority", giftType: 'ruler' },
  { id: 11, text: "Avoid being alone", giftType: 'exhorter' },
  { id: 12, text: "Sense the emotional atmosphere of a group/individual", giftType: 'mercy' },
  { id: 13, text: "See everything as either black or white", giftType: 'prophet' },
  { id: 14, text: "Enjoy showing hospitality", giftType: 'servant' },
  { id: 15, text: "Love to study and do research", giftType: 'teacher' },
  { id: 16, text: "Like to keep all options open as long as possible", giftType: 'giver' },
  { id: 17, text: "Will endure criticism in order to accomplish the task", giftType: 'ruler' },
  { id: 18, text: "Relate to people irrespective of culture, race, religion, background, etc.", giftType: 'exhorter' },
  { id: 19, text: "Avoid conflict and confrontation", giftType: 'mercy' },
  { id: 20, text: "Easily perceive the character of individuals or groups", giftType: 'prophet' },
  { id: 21, text: "Will stay with something until it is completed", giftType: 'servant' },
  { id: 22, text: "Emphasize facts and accuracy of words", giftType: 'teacher' },
  { id: 23, text: "Handle every situation as a unique situation", giftType: 'giver' },
  { id: 24, text: "Are skilled at time management", giftType: 'ruler' },
  { id: 25, text: "Love to encourage others to live victoriously", giftType: 'exhorter' },
  { id: 26, text: "Are attracted to people who are hurting or in distress", giftType: 'mercy' },
  { id: 27, text: "Operate on principals", giftType: 'prophet' },
  { id: 28, text: "Find it difficult to say \"no\" to requests for help", giftType: 'servant' },
  { id: 29, text: "Solve problems by starting with a theoretical foundation", giftType: 'teacher' },
  { id: 30, text: "Tend to be more relative than absolute", giftType: 'giver' },
  { id: 31, text: "Easily facilitate resources and people to accomplish tasks or goals", giftType: 'ruler' },
  { id: 32, text: "Want a visible response when teaching or speaking", giftType: 'exhorter' },
  { id: 33, text: "Easily detect insincerity or wrong motives", giftType: 'mercy' },
  { id: 34, text: "Are eager to see own blind spots and help others to see theirs also", giftType: 'prophet' },
  { id: 35, text: "Have a need to be appreciated", giftType: 'servant' },
  { id: 36, text: "Borrow things (e.g. books) without returning it promptly", giftType: 'teacher' },
  { id: 37, text: "View family as important", giftType: 'giver' },
  { id: 38, text: "Prefer to move on to a new challenge once something is completed", giftType: 'ruler' },
  { id: 39, text: "Greatly loved because of positive attitude", giftType: 'exhorter' },
  { id: 40, text: "Take care with words and actions to avoid hurting others", giftType: 'mercy' },
  { id: 41, text: "Feel the need to verbalise or dramatise what you perceive", giftType: 'prophet' },
  { id: 42, text: "Feel greatest joy in doing something that is helpful", giftType: 'servant' },
  { id: 43, text: "Have strong convictions and opinions based upon investigation of facts", giftType: 'teacher' },
  { id: 44, text: "Are concerned about the greater community", giftType: 'giver' },
  { id: 45, text: "Thrive under stress/pressure", giftType: 'ruler' },
  { id: 46, text: "View trials as opportunities to produce personal growth", giftType: 'exhorter' },
  { id: 47, text: "Are ruled by the heart rather than the head", giftType: 'mercy' },
  { id: 48, text: "Have strong opinions and convictions", giftType: 'prophet' },
  { id: 49, text: "Avoid leading others or projects", giftType: 'servant' },
  { id: 50, text: "Enjoy writing a lot", giftType: 'teacher' },
  { id: 51, text: "See money as security", giftType: 'giver' },
  { id: 52, text: "Want to see things completed as quickly as possible", giftType: 'ruler' },
  { id: 53, text: "Find it easy to communicate with others", giftType: 'exhorter' },
  { id: 54, text: "Sense things without being able to explain the \"how\"", giftType: 'mercy' },
  { id: 55, text: "Are frank, outspoken and do not mince words", giftType: 'prophet' },
  { id: 56, text: "Support those who are in leadership", giftType: 'servant' },
  { id: 57, text: "Tends to use biblical illustrations rather than life illustrations.", giftType: 'teacher' },
  { id: 58, text: "Gives freely of possessions / time / love but want only the best.", giftType: 'giver' },
  { id: 59, text: "Enjoys long-term projects and does not like routine.", giftType: 'ruler' },
  { id: 60, text: "Prefers to apply truth rather than research it.", giftType: 'exhorter' },
  { id: 61, text: "Rejoices when others are blessed, grieves if they are hurt.", giftType: 'mercy' },
  { id: 62, text: "Believes that tribulation produces personal brokenness / humbleness.", giftType: 'prophet' },
  { id: 63, text: "Is more interested in meeting the needs of others than own needs.", giftType: 'servant' },
  { id: 64, text: "Gets upset if scripture is used out of context.", giftType: 'teacher' },
  { id: 65, text: "Gives without other knowing about it.", giftType: 'giver' },
  { id: 66, text: "Can easily delegate tasks and supervises to other.", giftType: 'ruler' },
  { id: 67, text: "Wants to give people specific instructions on \"how-to-do-it\".", giftType: 'exhorter' },
  { id: 68, text: "Does not like to be rushed.", giftType: 'mercy' },
  { id: 69, text: "Believes that true repentance will be evidence by good fruit.", giftType: 'prophet' },
  { id: 70, text: "Works on immediate goals rather than long-term goals.", giftType: 'servant' },
  { id: 71, text: "Is self-disciplined and self-controlled", giftType: 'teacher' },
  { id: 72, text: "Has a strong belief in tithing / first-fruit offering.", giftType: 'giver' },
  { id: 73, text: "Is willing to let others get credit to get the job done.", giftType: 'ruler' },
  { id: 74, text: "Loves to do personal counselling, but stops if no effort to change is seen.", giftType: 'exhorter' },
  { id: 75, text: "Typically avoids conflict / confrontations.", giftType: 'mercy' },
  { id: 76, text: "Tends to only have one or two close friends and tends to be introspective.", giftType: 'prophet' },
  { id: 77, text: "Shows love in deeds and actions more than words.", giftType: 'servant' },
  { id: 78, text: "Believes that truth has the power to change.", giftType: 'teacher' },
  { id: 79, text: "Is not gullible / easily fooled.", giftType: 'giver' },
  { id: 80, text: "Is always writing notes to him- / herself.", giftType: 'ruler' },
  { id: 81, text: "Expects a lot of others.", giftType: 'exhorter' },
  { id: 82, text: "Loves doing thoughtful things for others.", giftType: 'mercy' },
  { id: 83, text: "Knows that he is called to be an intercessor.", giftType: 'prophet' },
  { id: 84, text: "Tends to do the job rather than delegate.", giftType: 'servant' },
  { id: 85, text: "Has a select circle of friends based on common interest.", giftType: 'teacher' },
  { id: 86, text: "Likes to see value for money.", giftType: 'giver' },
  { id: 87, text: "Know when to keep doing things in the old way and when to introduce new ideas.", giftType: 'ruler' },
  { id: 88, text: "Needs to have someone as a \"sounding board\" to listen to idea / concepts.", giftType: 'exhorter' },
  { id: 89, text: "Is more concerned about mental / emotional stress than physical discomfort.", giftType: 'mercy' },
  { id: 90, text: "Has a fervent desire to see God's Plan manifest in all situations.", giftType: 'prophet' },
  { id: 91, text: "Has a high energy level.", giftType: 'servant' },
];

// Scoring system
export const scoreValues = {
  NEVER: 1,
  SOMETIMES: 2,
  MOSTLY: 4,
  ALWAYS: 5
};

// Gift descriptions
export const giftDescriptions: Record<GiftType, { name: string, description: string }> = {
  prophet: {
    name: "Prophet",
    description: "Prophets are designed to reveal the Father's heart. They are principled, passionate, and deeply committed to truth. They often see issues in black and white and are motivated by a desire for justice and righteousness."
  },
  servant: {
    name: "Servant",
    description: "Servants are designed to reveal the Father's heart through practical service. They find joy in meeting the needs of others and are often the first to notice and respond to practical needs. They show love through actions rather than words."
  },
  teacher: {
    name: "Teacher",
    description: "Teachers are designed to reveal the Father's mind. They love to study, research, and present truth in a logical, systematic way. They value accuracy and precision in communication and believe that truth has the power to transform."
  },
  exhorter: {
    name: "Exhorter",
    description: "Exhorters are designed to reveal the Father's joy. They are natural encouragers who love to help others grow and develop. They are positive, relational, and skilled at communicating in ways that motivate others to action."
  },
  giver: {
    name: "Giver",
    description: "Givers are designed to reveal the Father's generosity. They are strategic in their giving and often have the ability to generate and manage resources well. They care deeply about family and community and give with wisdom and discernment."
  },
  ruler: {
    name: "Ruler",
    description: "Rulers are designed to reveal the Father's authority. They are visionary leaders who excel at organizing people and resources to accomplish goals. They thrive under pressure and are skilled at delegating and managing projects."
  },
  mercy: {
    name: "Mercy",
    description: "Mercy-givers are designed to reveal the Father's love. They have a tremendous capacity for empathy and are sensitive to the emotional needs of others. They create safe spaces for healing and restoration and are deeply intuitive."
  }
};
