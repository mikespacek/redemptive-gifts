'use client';

import { TestResult } from '../types/test-types';

/**
 * Send an email to the user using FormSubmit.co
 * This is a free service that doesn't require API keys
 * 
 * @param result The test result to send
 * @returns Promise with success status and message
 */
export async function sendFormSubmitEmail(
  result: TestResult
): Promise<{ success: boolean; message: string }> {
  try {
    // Check if user provided an email
    if (!result.email || !result.email.includes('@')) {
      console.log('No valid email provided, skipping FormSubmit email');
      return {
        success: false,
        message: 'No valid email provided'
      };
    }

    console.log('Sending FormSubmit email to user:', result.email);

    // Format the scores for email
    const formattedScores = result.columnScores ? 
      `Teacher: ${result.columnScores.T}, Giver: ${result.columnScores.G}, Ruler: ${result.columnScores.R}, 
       Exhorter: ${result.columnScores.E}, Mercy: ${result.columnScores.M}, Prophet: ${result.columnScores.P}, 
       Servant: ${result.columnScores.S}` : 
      'Scores not available';

    // Capitalize gift names
    const dominantGift = result.dominantGift.charAt(0).toUpperCase() + result.dominantGift.slice(1);
    const secondaryGift = result.secondaryGift.charAt(0).toUpperCase() + result.secondaryGift.slice(1);

    // Create a form element
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://formsubmit.co/' + result.email;
    form.style.display = 'none'; // Hide the form
    
    // Add form fields
    const addField = (name: string, value: string) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };
    
    // Add all the necessary fields
    addField('_subject', 'Your Design Test Results');
    addField('_template', 'box');
    addField('_captcha', 'false');
    addField('_next', window.location.origin + '/results');
    
    // Add test result fields
    addField('name', result.fullName || 'Friend');
    addField('dominant_gift', dominantGift);
    addField('secondary_gift', secondaryGift);
    addField('scores', formattedScores);
    addField('timestamp', new Date().toLocaleString());
    
    // Add the message
    const message = document.createElement('textarea');
    message.name = 'message';
    message.value = `
      Hello ${result.fullName || 'there'},

      Thank you for completing the Your Design test. Here are your results:

      Dominant Gift: ${dominantGift}
      Secondary Gift: ${secondaryGift}

      All Scores:
      ${formattedScores}

      Thank you,
      Union Houston
    `;
    form.appendChild(message);
    
    // Add the form to the document
    document.body.appendChild(form);
    
    // Submit the form
    console.log('Submitting FormSubmit form...');
    form.submit();
    
    // Remove the form after submission
    setTimeout(() => {
      if (document.body.contains(form)) {
        document.body.removeChild(form);
      }
    }, 1000);
    
    return {
      success: true,
      message: 'FormSubmit email sent successfully'
    };
  } catch (error) {
    console.error('Error in FormSubmit email sending:', error);
    return {
      success: false,
      message: `Error sending FormSubmit email: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
