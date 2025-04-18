# Redemptive Gifts Test

A web application that helps users discover their dominant redemptive gift based on Arthur Burk's teaching.

## About

The Redemptive Gifts Test is based on the concept of seven spiritual gifts from Romans 12:6-8. Arthur Burk has expanded on this biblical foundation to provide insights into how these gifts shape personality, motivation, and purpose.

Each person is believed to have one dominant gift that shapes their core view of the world, along with secondary gifts that influence them to lesser degrees. These gifts reflect different aspects of God's nature and provide insight into how we are designed to function in the world.

## Features

- Home page with information about redemptive gifts
- Questionnaire with 70 multiple-choice statements (scale of 1-5)
- User responses saved in Convex database
- Results page showing:
  - Bar chart comparing all 7 gift scores
  - Detailed explanation of the dominant and secondary gifts
- Admin page to view all test submissions and statistics

## Tech Stack

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS, Framer Motion
- **Database**: Google Sheets API
- **Email**: EmailJS
- **Charts**: Chart.js with react-chartjs-2
- **Forms**: react-hook-form

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/redemptive-gifts.git
cd redemptive-gifts
```

2. Install dependencies:
```
npm install
```

3. Set up environment variables:
```
cp .env.example .env.local
```

4. Update the environment variables in `.env.local` with your own values:
```
# EmailJS configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# Google Sheets integration
NEXT_PUBLIC_GOOGLE_SHEET_URL=your_google_script_url

# Admin email for notifications
NEXT_PUBLIC_ADMIN_EMAIL=your_email@example.com
```

5. Start the development server:
```
npm run dev
```

## Deployment

This project can be deployed on platforms like Vercel or Netlify.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Arthur Burk for his teaching on redemptive gifts
- The Sapphire Leadership Group for their work in this area
