/* eslint-disable import/extensions */
import 'dotenv/config';
import createServer from './Infrastructures/http/CreateServer.js';
import container from './Infrastructures/container.js';

const { PORT = 3000, HOST = 'localhost' } = process.env;

const start = async () => {
  const app = await createServer(container);
  app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
  });
};

start();
