import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { google } from 'googleapis';

admin.initializeApp();
const db = admin.firestore();

export const sendRSVPNotification = functions.firestore
  .document('events/{eventId}/rsvps/{userId}')
  .onCreate(async (snap, context) => {
    const eventId = context.params.eventId;
    const rsvpData = snap.data();
    const eventRef = db.doc(`events/${eventId}`);
    const eventSnap = await eventRef.get();
    const eventData = eventSnap.data();

    // Send notification logic here
    console.log(`RSVP received for event: ${eventData?.title} by ${rsvpData?.name}`);
    return;
  });

export const addToGoogleCalendar = functions.https.onCall(async (data, context) => {
  const { title, date, accessToken } = data;

  const calendar = google.calendar({ version: 'v3' });
  const event = {
    summary: title,
    start: { dateTime: date },
    end: { dateTime: new Date(new Date(date).getTime() + 60 * 60 * 1000).toISOString() },
  };

  const res = await calendar.events.insert({
    calendarId: 'primary',
    auth: accessToken,
    requestBody: event,
  });

  return { status: 'success', eventId: res.data.id };
});
