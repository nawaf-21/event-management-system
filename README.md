# Event Management System

## Project Description

The Event Management System is a web application built using React. It allows users to explore events, search for events, save their favourite events, and register for events. Event information is fetched from the Ticketmaster Discovery API.

## Features

- User registration, login, and logout
- Search events by keyword
- Filter events by category
- Filter upcoming events
- View event details, including date, time, venue, and location
- Save and remove saved events
- Register for events and cancel registrations
- View upcoming and completed registered events
- Store user accounts and event data in localStorage
- Responsive design for desktop and mobile screens

## Technologies Used

- React
- Vite
- JavaScript
- Redux Toolkit
- React Router
- Ticketmaster Discovery API
- HTML and CSS
- localStorage

## Installation and Setup

1. Clone this repository.
2. Open the project folder in your terminal.
3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root and add your Ticketmaster API key:

   ```text
   VITE_TICKETMASTER_API_KEY=your_ticketmaster_api_key
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL displayed in the terminal.

## How to Use

1. Register an account and log in.
2. Browse the available events on the Home page.
3. Search for events or use the available filters.
4. Open an event to view its details.
5. Save events or register for events.
6. Visit My Events to manage saved events and registrations.
7. Cancel a registration whenever needed.

## State Management

Redux Toolkit is used to manage the application state. The store and slices handle authentication, event data, saved events, and registrations. React Redux hooks are used to access and update the state.

## API Integration

The application uses the Ticketmaster Discovery API to retrieve event information. The API key is configured through an environment variable.

## Limitations

- Authentication is simulated on the frontend.
- User accounts and event data are stored in the browser's localStorage.
- The application does not have a backend database.
- Tickets are purchased through the Ticketmaster website.

## Author

Nawaf Ahmed
