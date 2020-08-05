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

class Logger {
  
  static info(message: string): void {
    console.log("\x1b[36m%s\x1b[0m", "[INFO]", "\x1b[2m", new Date().toLocaleString(), "\x1b[0m", `${message}`);
  }

  static error(message: string): void {
    console.log("\x1b[31m", "[ERROR]", "\x1b[2m", new Date().toLocaleString(), "\x1b[0m", `${message}`);
  }
}

export default Logger;