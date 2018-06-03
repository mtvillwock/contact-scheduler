/*
Copyright (C) 2018 Bryan Hughes <bryan@nebri.us>

Contact Schedular is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Contact Schedular is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Contact Schedular.  If not, see <http://www.gnu.org/licenses/>.
*/

import { CalendarSource } from '../common/types';

export const ACTIONS = {
  ADD_CALENDAR_REQUESTED: 'ADD_CALENDAR_REQUESTED',
  SELECT_CALENDAR_SOURCE: 'SELECT_CALENDAR_SOURCE',
  SAVE_CALENDAR: 'SAVE_CALENDAR',
  DELETE_CALENDAR: 'DELETE_CALENDAR'
};

export interface IAction {
  type: string;
}

export function addCalendar(): IAction {
  return {
    type: ACTIONS.ADD_CALENDAR_REQUESTED
  };
}

export interface ISelectCalendarAction extends IAction {
  source: CalendarSource;
}
export function selectCalendarSource(source: CalendarSource): ISelectCalendarAction {
  return {
    source,
    type: ACTIONS.SELECT_CALENDAR_SOURCE
  };
}
