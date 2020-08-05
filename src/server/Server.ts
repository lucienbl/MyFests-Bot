/*
 *   Copyright (c) 2020 Lucien Blunk-Lallet

 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.

 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.

 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';

class Server {
  static async start() {
    const app = await NestFactory.create(AppModule);

    const options = new DocumentBuilder()
    .setTitle('MyFests Bot')
    .setDescription('MyFests Bot API Documentation')
    .addBasicAuth()
    .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);

    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 5,
        message: {
          statusCode: 429,
          message: "You are being rate limited. Please try again later.",
          error: "Too Many Requests"
        }
      }),
    );

    await app.listen(process.env.API_PORT);
  }
}

export default Server;