import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigurationService } from './config/configuration.service';
import { LoggerManager } from './platform/logging/logger.manager';
import { printStartupBanner } from './kernel/banner';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.enableShutdownHooks();

  const configService = app.get(ConfigurationService);
  const logger = app.get(LoggerManager);
  logger.setContext('Kernel');

  const port = configService.port;
  await app.listen(port);

  printStartupBanner(logger, port);
  logger.info(
    `AURA Kernel started successfully in ${configService.environment} mode`,
    {
      port,
      environment: configService.environment,
    },
  );
}
bootstrap().catch((err) => {
  console.error('Bootstrap error:', err);
  process.exit(1);
});
