import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { configSwagger } from 'src/config/api-docs';

declare const module: any;
const PORT = process.env.PORT || 3000;
const VER = process.env.API_VERSION || 'api/v1';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(VER);
  app.use(cookieParser());
  app.enableCors();

  configSwagger(app);
  await app.listen(PORT);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
