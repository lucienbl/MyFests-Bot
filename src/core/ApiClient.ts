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

import { superagent } from '../utils';

class ApiClient {
  static validateDiscordId(discordId: string): Promise<any> {
    return superagent
      .get(`${this._baseUrl()}&REQUEST=authentication&DATA=${discordId}`)
  }

  static _baseUrl() {
    return `${process.env.HABBO_BASE_API_URL}?API=${process.env.HABBO_APP_ID}&KEY=${process.env.HABBO_API_KEY}`;
  }
}

export default ApiClient;