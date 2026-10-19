
import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./eventsSlice";
import authReducer from "./authSlice";

const savedUser = localStorage.getItem("user");
const currentUser = savedUser ? JSON.parse(savedUser) : null;

const savedEventsKey = currentUser
  ? "savedEvents_" + currentUser.email
  : "savedEvents_guest";

const registrationsKey = currentUser
  ? "registrations_" + currentUser.email
  : "registrations_guest";

const initialState = {
  events: {
    events: [],
    savedEvents: JSON.parse(localStorage.getItem(savedEventsKey) || "[]"),
    registrations: JSON.parse(localStorage.getItem(registrationsKey) || "[]"),
    loading: false,
    error: ""
  },
  auth: {
    user: currentUser
  }
};

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    auth: authReducer
  },
  preloadedState: initialState
});

let previousUserEmail = currentUser ? currentUser.email : null;

store.subscribe(() => {
  const state = store.getState();
  const user = state.auth.user;
  const currentEmail = user ? user.email : null;

  // Do not save the previous account's data under the new account.
  if (currentEmail !== previousUserEmail) {
    previousUserEmail = currentEmail;
    return;
  }

  const userSavedEventsKey = user
    ? "savedEvents_" + user.email
    : "savedEvents_guest";

  const userRegistrationsKey = user
    ? "registrations_" + user.email
    : "registrations_guest";

  localStorage.setItem(
    userSavedEventsKey,
    JSON.stringify(state.events.savedEvents)
  );

  localStorage.setItem(
    userRegistrationsKey,
    JSON.stringify(state.events.registrations)
  );
});
