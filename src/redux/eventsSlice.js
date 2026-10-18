
import { createSlice } from "@reduxjs/toolkit";

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    savedEvents: [],
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
    removeSavedEvent: (state, action) => {
      state.savedEvents = state.savedEvents.filter(
        (event) => event.id !== action.payload
      );
    }
  }
});

export const {
  setEvents,
  setLoading,
  setError,
  saveEvent,
  removeSavedEvent
} = eventsSlice.actions;

export default eventsSlice.reducer;
