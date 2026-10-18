
import { useSelector, useDispatch } from "react-redux";
import { removeSavedEvent } from "../redux/eventsSlice";

function MyEvents() {
  const dispatch = useDispatch();

  const savedEvents = useSelector(
    (state) => state.events.savedEvents
  );

  return (
    <div>
      <h1>My Events</h1>
      <p>Here are the events you have saved.</p>

      {savedEvents.length === 0 ? (
        <p>You have not saved any events yet.</p>
      ) : (
        <div className="events">
          {savedEvents.map((event) => (
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

              <a href={event.url} target="_blank" rel="noreferrer">
                View Event
              </a>

              <button onClick={() => dispatch(removeSavedEvent(event.id))}>
                Remove Event
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyEvents;
