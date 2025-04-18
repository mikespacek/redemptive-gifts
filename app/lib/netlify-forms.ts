/**
 * Email service for sending test results using Netlify Forms
 * 
 * This module uses Netlify Forms to send emails.
 * No domain validation required, works with Netlify hosting.
 */

import { TestResult } from './google-sheets';

/**
 * Send test results via Netlify Forms
 * 
 * @param result The test result to send
 * @returns A promise that resolves when the form is submitted
 */
export async function sendResultsNetlify(result: TestResult): Promise<{ success: boolean; message: string }> {
  try {
    // Format the scores for the form
    const formattedScores = Object.entries(result.scores)
      .map(([gift, score]) => `${gift.charAt(0).toUpperCase() + gift.slice(1)}: ${score}`)
      .join(", ");

    // Create a hidden form element
    const form = document.createElement('form');
    form.setAttribute('name', 'redemptive-gifts-results');
    form.setAttribute('method', 'POST');
    form.setAttribute('data-netlify', 'true');
    form.setAttribute('hidden', 'true');
    
    // Add the form fields
    const fields = [
      { name: 'form-name', value: 'redemptive-gifts-results' },
      { name: 'name', value: result.fullName || 'Anonymous User' },
      { name: 'email', value: result.email || 'Not provided' },
      { name: 'date', value: new Date(result.timestamp).toLocaleString() },
      { name: 'dominant_gift', value: result.dominantGift },
      { name: 'secondary_gift', value: result.secondaryGift },
      { name: 'scores', value: formattedScores }
    ];
    
    // Add fields to the form
    fields.forEach(field => {
      const input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('name', field.name);
      input.setAttribute('value', field.value);
      form.appendChild(input);
    });
    
    // Add the form to the document
    document.body.appendChild(form);
    
    // Submit the form
    const formData = new FormData(form);
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData as any).toString()
    });
    
    // Remove the form
    document.body.removeChild(form);
    
    if (!response.ok) {
      throw new Error(`Form submission failed with status: ${response.status}`);
    }
    
    return { success: true, message: "Form submitted successfully" };
  } catch (error) {
    console.error('Netlify Forms ERROR:', error);
    return { 
      success: false, 
      message: "Failed to submit form: " + (error as Error).message 
    };
  }
}
