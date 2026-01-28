import { bootstrap, runMigrations } from '@vendure/core';
import { config } from './vendure-config';

runMigrations(config)
  .then(() => bootstrap(config))
  .catch((err) => {
    console.error('Error starting Vendure server:', err);
    process.exit(1);
  });
