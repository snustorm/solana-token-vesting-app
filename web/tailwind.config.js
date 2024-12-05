const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
        colors: {
            yellow: {
              500: '#dcca44', // Sets yellow-500 as #fee440
            },
            blue: {
              500: '#276FBF', // Sets blue-500 as #4472CA
            },
            white: '#ffffff', // Ensures white is set as #ffffff
          },
          spacing: {
            12: '3rem', // Adjust height as needed
          },
          boxShadow: {
            'light-3d': '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
    },
  },
  plugins: [require('daisyui')],
};
