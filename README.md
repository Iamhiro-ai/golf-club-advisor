# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deployment

When deploying with Vercel, make sure the project is connected to the `main`
branch. Attempting to deploy the `gh-pages` branch results in an error stating
`Could not read package.json` because that branch only contains the built
static files. Push to the `main` branch—even with an empty commit—to trigger a
successful deployment.

For more detailed deployment steps, see [DEPLOYMENT.md](DEPLOYMENT.md).
