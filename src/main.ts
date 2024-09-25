import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: ['http://localhost:3000', 'https://stylist-marina.vercel.app'],
  });
  const port = process.env.PORT || 8080;
  const config = new DocumentBuilder()
    .setTitle('Marusya Stylist API')
    .addServer(
      'https://payable-trudy-subx1s0o-5013b076.koyeb.app',
      'Production',
    )
    .setDescription(
      "This API enables the management of products on the Stylist-Makeup Artist website, allowing for the addition, editing, and deletion of items. It also provides the ability to view the stylist's portfolio photos. The API integrates with a custom bot to notify the owner when the /contacts endpoint is used",
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);
  await app.listen(port);
}
bootstrap();
