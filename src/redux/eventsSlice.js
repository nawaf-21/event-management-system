
import { createSlice } from "@reduxjs/toolkit";

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    savedEvents: [],
    registrations: [],
    loading: false,
    error: ""
  },
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    saveEvent: (state, action) => {
      const event = action.payload;
      const alreadySaved = state.savedEvents.some(
        (saved) => saved.id === event.id
      );

      if (!alreadySaved) {
        state.savedEvents.push(event);
      }
    },
    setUserEvents: (state, action) => {
        state.savedEvents = action.payload.savedEvents;
        state.registrations = action.payload.registrations;
    },
    removeSavedEvent: (state, action) => {
      state.savedEvents = state.savedEvents.filter(
        (event) => event.id !== action.payload
      );
    },
    registerEvent: (state, action) => {
      const { event, userEmail } = action.payload;

      const alreadyRegistered = state.registrations.some(
        (item) =>
          item.event.id === event.id &&
          item.userEmail === userEmail
      );

      if (!alreadyRegistered) {
        state.registrations.push({
          event: event,
          userEmail: userEmail
        });
      }
    },
    cancelRegistration: (state, action) => {
      const { eventId, userEmail } = action.payload;

      state.registrations = state.registrations.filter(
        (item) =>
          !(item.event.id === eventId && item.userEmail === userEmail)
      );
    }
  }
});

export const {
  setEvents,
  setLoading,
  setError,
  setUserEvents,
  saveEvent,
  removeSavedEvent,
  registerEvent,
  cancelRegistration
} = eventsSlice.actions;

export default eventsSlice.reducer;
