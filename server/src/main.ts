import './polyfill';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const parseOrigins = (raw?: string) =>
  (raw ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:4000',
  ];
  const envOrigins = parseOrigins(process.env.CORS_ORIGINS);
  const clientUrl = process.env.CLIENT_URL?.trim();
  const allowList = [...new Set([...defaultOrigins, ...envOrigins, ...(clientUrl ? [clientUrl] : [])])];

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);

      if (allowList.includes(origin)) return cb(null, true);

      try {
        const host = new URL(origin).hostname;
        if (/\.onrender\.com$/i.test(host)) return cb(null, true);
      } catch {

      }

      return cb(new Error(`CORS blocked for ${origin}`), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port, '0.0.0.0');
  console.log(`✅ Nest API listening on port ${port}`);
}

bootstrap();
