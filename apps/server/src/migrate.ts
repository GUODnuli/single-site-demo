import { generateMigration, revertLastMigration, runMigrations } from '@vendure/core';
import { config } from './vendure-config';

const command = process.argv[2];

(async () => {
  try {
    switch (command) {
      case 'generate':
        const name = process.argv[3] || 'Migration';
        await generateMigration(config, { name });
        console.log('✅ Migration generated successfully');
        break;

      case 'run':
        await runMigrations(config);
        console.log('✅ Migrations completed successfully');
        break;

      case 'revert':
        await revertLastMigration(config);
        console.log('✅ Last migration reverted successfully');
        break;

      default:
        console.log('Usage: ts-node src/migrate.ts [generate|run|revert] [name]');
        console.log('  generate [name] - Generate a new migration');
        console.log('  run             - Run pending migrations');
        console.log('  revert          - Revert the last migration');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
})();
