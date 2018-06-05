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

import { join } from 'path';
import { series } from 'async';
import { app, BrowserWindow, ipcMain, Event } from 'electron';
import { MessageTypes } from './common/messages';
import { ICalendar, IContact, CB } from './common/types';
import {
  IAppArguments,
  IContactDialogArguments,
  ISaveContactMessageArguments,
  IDeleteContactMessageArguments,
  ICalendarDialogArguments,
  ISaveCalendarMessageArguments,
  IDeleteCalendarMessageArguments } from './common/arguments';
import { init as initDB, getCalendars, createCalendar, getContacts, createContact } from './db';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null = null;
const dialogWindows: BrowserWindow[] = [];

function createWindow(args: IAppArguments) {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      additionalArguments: [ JSON.stringify(args) ]
    }
  } as any);
  mainWindow.loadFile(join(__dirname, '..', 'renderer', 'app.html'));
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.on('ready', () => {
  series([
    (next: CB) => initDB(next),
    (next: CB) => getCalendars(next),
    (next: CB) => getContacts(next)
  ], (err, results) => {
    if (err || !results) {
      console.error(err);
      process.exit(-1);
      return;
    }
    const calendars: ICalendar[] = results[1] as any;
    const contacts: IContact[] = results[2] as any;
    createWindow({
      calendars,
      contacts
    });
    console.log('running');
  });
});

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  // if (mainWindow === null) {
  //   createWindow();
  // }
  // TODO: re-enable the above
});

function openDialogWindow(contentPath: string, title: string, args: { [ key: string ]: any }): void {
  const dialogWindow = new BrowserWindow({
    width: 640,
    height: 480,
    webPreferences: {
      additionalArguments: [ JSON.stringify(args) ]
    }
  } as any);
  dialogWindow.setMenu(null);

  dialogWindow.loadFile(contentPath);
  dialogWindow.setTitle(title);
  // dialogWindow.webContents.openDevTools();

  dialogWindow.on('closed', () => {
    dialogWindows.splice(dialogWindows.indexOf(dialogWindow));
  });

  dialogWindows.push(dialogWindow);
}

ipcMain.on(MessageTypes.RequestAddContact, (event: Event, arg: string) => {
  const args: IContactDialogArguments = {
    isAdd: true
  };
  openDialogWindow(join(__dirname, '..', 'renderer', 'contact.html'), 'Add Contact', args);
});

ipcMain.on(MessageTypes.RequestEditContact, (event: Event, arg: string) => {
  const args: IContactDialogArguments = {
    isAdd: false
  };
  openDialogWindow(join(__dirname, '..', 'renderer', 'contact.html'), 'Add Contact', args);
});

ipcMain.on(MessageTypes.RequestSaveContact, (event: Event, arg: string) => {
  const parsedArgs: ISaveContactMessageArguments = JSON.parse(arg);
  function finalize() {
    (event.sender as any).getOwnerBrowserWindow().close();
    // TODO: Need to propogate changes to renderer
  }
  if (typeof parsedArgs.contact.id !== 'number' || isNaN(parsedArgs.contact.id)) {
    createContact(parsedArgs.contact, (err) => {
      if (err) {
        console.error(err);
      }
      finalize();
    });
  } else {
    // TODO once editing contacts is implemented
    finalize();
  }
});

ipcMain.on(MessageTypes.RequestDeleteContact, (event: Event, arg: string) => {
  const args: IDeleteContactMessageArguments = JSON.parse(arg);
  console.log(args.contact);
  // TODO: delete contacts from db
  (event.sender as any).getOwnerBrowserWindow().close();
});

ipcMain.on(MessageTypes.RequestAddCalendar, (event: Event, arg: string) => {
  const args: ICalendarDialogArguments = {
    isAdd: true
  };
  openDialogWindow(join(__dirname, '..', 'renderer', 'calendar.html'), 'Add Calendar', args);
});

ipcMain.on(MessageTypes.RequestEditCalendar, (event: Event, arg: string) => {
  const args: ICalendarDialogArguments = {
    isAdd: false
  };
  openDialogWindow(join(__dirname, '..', 'renderer', 'calendar.html'), 'Add Calendar', args);
});

ipcMain.on(MessageTypes.RequestSaveCalendar, (event: Event, arg: string) => {
  const parsedArgs: ISaveCalendarMessageArguments = JSON.parse(arg);
  function finalize() {
    (event.sender as any).getOwnerBrowserWindow().close();
    // TODO: Need to propogate changes to renderer
  }
  if (typeof parsedArgs.calendar.id !== 'number' || isNaN(parsedArgs.calendar.id)) {
    createCalendar(parsedArgs.calendar, (err) => {
      if (err) {
        console.error(err);
      }
      finalize();
    });
  } else {
    // TODO once editing calendars is implemented
    finalize();
  }
});

ipcMain.on(MessageTypes.RequestDeleteCalendar, (event: Event, arg: string) => {
  const args: IDeleteCalendarMessageArguments = JSON.parse(arg);
  console.log(args.calendar);
  // TODO: delete calendar from db
  (event.sender as any).getOwnerBrowserWindow().close();
});
