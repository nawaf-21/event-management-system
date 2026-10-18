
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setEvents, setLoading, setError } from "../redux/eventsSlice";

function Home() {
  const dispatch = useDispatch();

  const events = useSelector((state) => state.events.events);
  const loading = useSelector((state) => state.events.loading);
  const error = useSelector((state) => state.events.error);

  const [search, setSearch] = useState("");

  function getEvents(keyword = "") {
    dispatch(setLoading(true));
    dispatch(setError(""));

    let url =
      "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" +
      import.meta.env.VITE_TICKETMASTER_API_KEY +
      "&size=20";

    if (keyword.trim() !== "") {
      url += "&keyword=" + encodeURIComponent(keyword);
    }

    console.log("API key loaded:", !!import.meta.env.VITE_TICKETMASTER_API_KEY);
    console.log("Request URL:", url.replace(
      import.meta.env.VITE_TICKETMASTER_API_KEY,
      "HIDDEN"
    ));

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("API request failed: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        dispatch(setEvents(data._embedded?.events || []));
      })
      .catch((error) => {
        console.error("Ticketmaster error:", error);
        dispatch(setError(error.message));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }

  useEffect(() => {
    getEvents();
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    getEvents(search);
  }

  return (
    <div>
      <h1>Explore Events</h1>
      <p>Find events and register for the ones you like.</p>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading events...</p>}
      {error && <p>{error}</p>}

      <div className="events">
        {events.map((event) => (
          <div className="event-card" key={event.id}>
            {event.images && event.images.length > 0 && (
              <img
                src={event.images[0].url}
                alt={event.name}
              />
            )}

            <h3>{event.name}</h3>

            <p>
              Date: {event.dates?.start?.localDate || "Not available"}
            </p>

            <p>
              Venue:{" "}
              {event._embedded?.venues?.[0]?.name || "Not available"}
            </p>

            <p>
              Location:{" "}
              {event._embedded?.venues?.[0]?.city?.name || "Not available"}
            </p>

            <a
              href={event.url}
              target="_blank"
              rel="noreferrer"
            >
              View Event
            </a>
          </div>
        ))}
      </div>

      {!loading && !error && events.length === 0 && (
        <p>No events found.</p>
      )}
    </div>
  );
}

export default Home;
