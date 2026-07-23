import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigurationService } from './config/configuration.service';
import { printStartupBanner } from './kernel/banner';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigurationService);
  const port = configService.port;
  await app.listen(port);
  printStartupBanner(port);
}
bootstrap();
