import serverless from "serverless-http";
import { app } from "../../server/index.js";

// Wrap the Express app so Netlify can handle it as an AWS Lambda-style function
export const handler = serverless(app);
