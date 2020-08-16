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

import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiBasicAuth, ApiResponse } from '@nestjs/swagger';
import { ForumService } from './forum.service';
import { AuthGuard } from '../auth.guard';
import { NewThreadDto, NewLogDto } from './forum.dto';

@ApiTags("Forum")
@ApiBasicAuth()
@UseGuards(AuthGuard)
@Controller('forum')
export class ForumController {

  constructor(
    private readonly forumService: ForumService
  ) {}

  @Post("thread")
  @ApiResponse({ type: NewThreadDto })
  newThread(@Body() newThreadDto: NewThreadDto): Promise<NewThreadDto> {
    return this.forumService.newThread(newThreadDto);
  }

  @Post("log")
  @ApiResponse({ type: NewLogDto })
  newLog(@Body() newLogDto: NewLogDto): Promise<NewLogDto> {
    return this.forumService.newLog(newLogDto);
  }

  @Post("adminlog")
  @ApiResponse({ type: NewLogDto })
  newAdminLog(@Body() newLogDto: NewLogDto): Promise<NewLogDto> {
    return this.forumService.newAdminLog(newLogDto);
  }
}
