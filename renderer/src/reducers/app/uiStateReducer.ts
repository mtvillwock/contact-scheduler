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

import { Reducer } from 'redux';
import { IAction, ACTIONS } from '../../actions/actions';
import { IUIState } from '../../util/types';

export function createUIStateReducer(): Reducer<IUIState> {
  const DEFAULT_STATE: IUIState = {
    tab: 'home'
  };
  return (state: IUIState | undefined, action: IAction) => {
    if (!state) {
      state = DEFAULT_STATE;
    }
    switch (action.type) {
      case ACTIONS.NAVIGATE_TO_HOME:
        return {
          ...state,
          tab: 'home'
        };
      case ACTIONS.NAVIGATE_TO_CONTACTS:
        return {
          ...state,
          tab: 'contacts'
        };
      case ACTIONS.NAVIGATE_TO_CALENDARS:
        return {
          ...state,
          tab: 'calendars'
        };
      default:
        return state;
    }
  };
}
