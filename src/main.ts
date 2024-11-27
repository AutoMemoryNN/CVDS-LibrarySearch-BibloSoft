import { config } from 'dotenv';
config({ override: false });

import { AppModule } from '@app/app.module';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);

	const config = new DocumentBuilder()
		.setTitle('Auth service')
		.setDescription('An auth service for authentication and authorization')
		.setVersion('1.0')
		.addTag('Auth')
		.addBearerAuth({
			type: 'http',
			scheme: 'bearer',
			bearerFormat: 'Bearer <token>',
		})
		.build();
	const documentFactory = (): OpenAPIObject =>
		SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, documentFactory);

	await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
