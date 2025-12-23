<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1fDwHc7gFZHNzWt2IW67iThu-M4UoO52L

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Firebase Hosting

1. Create `.env.local` from `.env.example` and fill in your Firebase web config values.
2. Install the Firebase CLI (choose one):
   `npm i -g firebase-tools`
   `npx firebase-tools login`
3. If you need a different project, update `.firebaserc` or run:
   `firebase use --add`
4. Build and deploy:
   `npm run build`
   `firebase deploy --only hosting`
