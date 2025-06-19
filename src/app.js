import express from 'express';
import 'dotenv/config';

const app = express();

// env variables
const { PORT } = process.env;
const { HOST } = process.env;

// routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// start server
app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
