/**
 * Interface for test results
 */
export interface TestResult {
  userId: string;
  scores: Record<string, number>;
  dominantGift: string;
  secondaryGift: string;
  timestamp: number;
  fullName?: string;
  email?: string;
  firstName?: string;
  columnScores?: {
    T: number; // Teacher
    G: number; // Giver
    R: number; // Ruler
    E: number; // Exhorter
    M: number; // Mercy
    P: number; // Prophet
    S: number; // Servant
  };
}
