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

import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBasicAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth.guard';
import { NewMediaDto, NewEventDto, NewRadioDto, NewFurniDto } from './community.dto';
import { CommunityService } from './community.service';

@ApiTags("Community")
@ApiBasicAuth()
@UseGuards(AuthGuard)
@Controller('community')
export class CommunityController {

  constructor(
    private readonly communityService: CommunityService
  ) {}

  @Post("media")
  @ApiResponse({ type: NewMediaDto })
  newMedia(@Body() newMediaDto: NewMediaDto): Promise<NewMediaDto> {
    return this.communityService.newMedia(newMediaDto);
  }

  @Post("event")
  @ApiResponse({ type: NewEventDto })
  newEvent(@Body() newEventDto: NewEventDto): Promise<NewEventDto> {
    return this.communityService.newEvent(newEventDto);
  }

  @Post("radio")
  @ApiResponse({ type: NewRadioDto })
  newRadio(@Body() newRadioDto: NewRadioDto): Promise<NewRadioDto> {
    return this.communityService.newRadio(newRadioDto);
  }
  
  @Post("furni")
  @ApiResponse({ type: NewFurniDto })
  newFurni(@Body() newRadioDto: NewFurniDto): Promise<NewFurniDto> {
    return this.communityService.newFurni(NewFurniDto);
  }
}
