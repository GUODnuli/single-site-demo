import { bootstrapWorker } from '@vendure/core';
import { config } from './vendure-config';

bootstrapWorker(config)
  .then((worker) => worker.startJobQueue())
  .catch((err) => {
    console.error('Error starting Vendure worker:', err);
    process.exit(1);
  });
