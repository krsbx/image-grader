import { config as dotenvConfig } from 'dotenv';
import { expand as expandDotenv } from 'dotenv-expand';
import express from 'express';

expandDotenv(dotenvConfig());

const PORT = process.env.PORT || 3001;

const app = express();

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
