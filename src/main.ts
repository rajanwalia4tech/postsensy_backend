import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as cors from 'cors';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setting up global-scoped pipe for validation on every route
  // app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors  = validationErrors.map((error) => (
          Object.values(error.constraints)
          ))
          return new BadRequestException(errors[0][0]);
      },
    }),
  );
  const configService = app.get<ConfigService>(ConfigService);
  const PORT = configService.get("PORT");
  app.use(cors());
  await app.listen(PORT,()=>{
    console.log("Server is running on PORT : ",PORT)
  });
}
bootstrap();
