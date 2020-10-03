import express from 'express';
import { createServer } from 'http';
import { errorHandler, validationErrorHandler } from './middleware/errorHandler';
import appRouter from './routers';
import DB from './services/db/db';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/', appRouter);
app.use(validationErrorHandler);
app.use(errorHandler);

function handleAppListening(): void {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
}

const server = createServer(app);

async function start() {
  await DB.init();
  server.listen(port, handleAppListening);
}

start();

export default server;
