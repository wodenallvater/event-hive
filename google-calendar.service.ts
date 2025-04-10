import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class GoogleCalendarService {
  constructor(private http: HttpClient) {}

  addEventToCalendar(event: any, accessToken: string) {
    const calendarUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    const headers = { Authorization: `Bearer ${accessToken}` };

    const eventData = {
      summary: event.title,
      start: { dateTime: event.date },
      end: { dateTime: new Date(new Date(event.date).getTime() + 60 * 60 * 1000).toISOString() },
    };

    return this.http.post(calendarUrl, eventData, { headers });
  }
}
