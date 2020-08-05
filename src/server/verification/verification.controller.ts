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

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBasicAuth } from '@nestjs/swagger';
import { VerificationService } from './verification.service';
import { AuthGuard } from '../auth.guard';

@ApiTags("Verification")
@ApiBasicAuth()
@UseGuards(AuthGuard)
@Controller('verification')
export class VerificationController {

  constructor(
    private readonly verificationService: VerificationService
  ) {}

  @Get()
  getAll() {
    return this.verificationService.verification();
  }

}
