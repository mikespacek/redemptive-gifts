'use client';

import { TestResult } from '../types/test-types';

/**
 * Generate a downloadable text file with the test results
 * 
 * @param result The test result to include in the file
 */
export function downloadTestResults(result: TestResult): void {
  try {
    // Format the scores for the file
    const formattedScores = result.columnScores ? 
      `Teacher: ${result.columnScores.T}, Giver: ${result.columnScores.G}, Ruler: ${result.columnScores.R}, 
       Exhorter: ${result.columnScores.E}, Mercy: ${result.columnScores.M}, Prophet: ${result.columnScores.P}, 
       Servant: ${result.columnScores.S}` : 
      'Scores not available';

    // Capitalize gift names
    const dominantGift = result.dominantGift.charAt(0).toUpperCase() + result.dominantGift.slice(1);
    const secondaryGift = result.secondaryGift.charAt(0).toUpperCase() + result.secondaryGift.slice(1);

    // Create the file content
    const fileContent = `
YOUR DESIGN TEST RESULTS
========================

Name: ${result.fullName || 'Anonymous'}
Date: ${new Date().toLocaleDateString()}

DOMINANT GIFT: ${dominantGift}
SECONDARY GIFT: ${secondaryGift}

ALL SCORES:
${formattedScores}

Thank you for completing the Your Design test.
Union Houston
`;

    // Create a blob with the file content
    const blob = new Blob([fileContent], { type: 'text/plain' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = `Your_Design_Results_${new Date().toISOString().split('T')[0]}.txt`;
    
    // Append the link to the document
    document.body.appendChild(link);
    
    // Click the link to download the file
    link.click();
    
    // Remove the link from the document
    document.body.removeChild(link);
    
    // Revoke the URL to free up memory
    URL.revokeObjectURL(url);
    
    console.log('Test results downloaded successfully');
  } catch (error) {
    console.error('Error downloading test results:', error);
  }
}
