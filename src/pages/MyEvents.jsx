
import { useSelector, useDispatch } from "react-redux";
import {
  removeSavedEvent,
  cancelRegistration
} from "../redux/eventsSlice";

function MyEvents() {
  const dispatch = useDispatch();

  const savedEvents = useSelector((state) => state.events.savedEvents);
  const registrations = useSelector((state) => state.events.registrations);
  const user = useSelector((state) => state.auth.user);

  const myRegistrations = registrations.filter(
    (item) => item.userEmail === user.email
  );

  const today = new Date().toISOString().split("T")[0];

  const upcomingEvents = myRegistrations.filter(
    (item) => {
      const eventDate = item.event.dates?.start?.localDate;
      return !eventDate || eventDate >= today;
    }
  );

  const completedEvents = myRegistrations.filter(
    (item) => {
      const eventDate = item.event.dates?.start?.localDate;
      return eventDate && eventDate < today;
    }
  );

  function handleCancel(eventId) {
    dispatch(cancelRegistration({
      eventId: eventId,
      userEmail: user.email
    }));
  }

  function displayEvent(event, registered = false) {
    return (
      <div className="event-card" key={event.id}>
        {event.images && event.images.length > 0 && (
          <img src={event.images[0].url} alt={event.name} />
        )}

        <h3>{event.name}</h3>

        <p>
          Date: {event.dates?.start?.localDate || "Not available"}
        </p>

        <p>
          Venue: {event._embedded?.venues?.[0]?.name || "Not available"}
        </p>

        <p>
          Location: {event._embedded?.venues?.[0]?.city?.name || "Not available"}
        </p>

        <a href={event.url} target="_blank" rel="noreferrer">
          View Event
        </a>

        {registered ? (
          <p>
            <button onClick={() => handleCancel(event.id)}>
              Cancel Registration
            </button>
          </p>
        ) : (
          <p>
            <button onClick={() => dispatch(removeSavedEvent(event.id))}>
              Remove Saved Event
            </button>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="page">
      <h1>My Events</h1>

      <h2>My Registrations</h2>

      <h3>Upcoming Events</h3>

      {upcomingEvents.length === 0 ? (
        <p>You have no upcoming registered events.</p>
      ) : (
        <div className="events">
          {upcomingEvents.map((item) => displayEvent(item.event, true))}
        </div>
      )}

      <h3>Completed Events</h3>

      {completedEvents.length === 0 ? (
        <p>You have no completed registered events.</p>
      ) : (
        <div className="events">
          {completedEvents.map((item) => displayEvent(item.event, true))}
        </div>
      )}

      <h2>Saved Events</h2>

      {savedEvents.length === 0 ? (
        <p>You have no saved events.</p>
      ) : (
        <div className="events">
          {savedEvents.map((event) => displayEvent(event))}
        </div>
      )}
    </div>
  );
}

export default MyEvents;
