
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    const url =
      "/api/ticketmaster/discovery/v2/events/" +
      id +
      ".json?apikey=" +
      import.meta.env.VITE_TICKETMASTER_API_KEY;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load event details.");
        }

        return response.json();
      })
      .then((data) => {
        setEvent(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p>Loading event details...</p>;
  }

  if (error || !event) {
    return (
      <div>
        <h1>Event Not Found</h1>
        <p>{error || "This event is not available."}</p>
        <Link to="/">Back to Events</Link>
      </div>
    );
  }

  const venue = event._embedded?.venues?.[0];

  return (
    <div className="event-details">
      {event.images?.length > 0 && (
        <img src={event.images[0].url} alt={event.name} />
      )}

      <h1>{event.name}</h1>

      <p>
        <strong>Date:</strong>{" "}
        {event.dates?.start?.localDate || "Not available"}
      </p>

      <p>
        <strong>Time:</strong>{" "}
        {event.dates?.start?.localTime || "Not available"}
      </p>

      <p>
        <strong>Venue:</strong> {venue?.name || "Not available"}
      </p>

      <p>
        <strong>City:</strong> {venue?.city?.name || "Not available"}
      </p>

      <p>
        <strong>Address:</strong>{" "}
        {venue?.address?.line1 || "Not available"}
      </p>

      <p>
        <strong>Category:</strong>{" "}
        {event.classifications?.[0]?.segment?.name || "Not available"}
      </p>

      {event.info && <p>{event.info}</p>}

      {event.pleaseNote && <p>{event.pleaseNote}</p>}

      {event.url && (
        <p>
          <a href={event.url} target="_blank" rel="noreferrer">
            Buy Tickets
          </a>
        </p>
      )}

      <Link to="/">Back to Events</Link>
    </div>
  );
}

export default EventDetails;
