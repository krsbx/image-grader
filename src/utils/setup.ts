import { config as dotenvConfig } from 'dotenv';
import { expand as expandDotenv } from 'dotenv-expand';

export const setupEnv = () => expandDotenv(dotenvConfig());
