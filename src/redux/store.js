
import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./eventsSlice";

const savedEvents = localStorage.getItem("savedEvents");

const initialState = {
  events: {
    events: [],
    savedEvents: savedEvents ? JSON.parse(savedEvents) : [],
    loading: false,
    error: ""
  }
};

export const store = configureStore({
  reducer: {
    events: eventsReducer
  },
  preloadedState: initialState
});

store.subscribe(() => {
  const savedEvents = store.getState().events.savedEvents;
  localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
});
