import serverless from "serverless-http";
import { app } from "../../server/index.js";

// Wrap the Express app so Netlify can handle it.
// We must set basePath to '/.netlify/functions' because Netlify rewrites /api/* to /.netlify/functions/api/*
const serverlessHandler = serverless(app, {
  basePath: '/.netlify/functions'
});

export const handler = async (event, context) => {
  // If the path doesn't have the prefix (e.g. local testing), force it to work
  if (!event.path.startsWith('/.netlify/functions')) {
    event.path = '/.netlify/functions' + event.path;
  }
  return await serverlessHandler(event, context);
};
