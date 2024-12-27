import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);


    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            exceptionFactory: (errors) => {
                const formattedErrors = errors.map((error) => ({
                    field: error.property,
                    errors: Object.values(error.constraints),
                }));
                return new BadRequestException({
                    statusCode: 400,
                    message: 'Validation failed',
                    errors: formattedErrors,
                });
            },
        }),
    );

    // Start the application
    await app.listen(process.env.PORT);
}
bootstrap();
