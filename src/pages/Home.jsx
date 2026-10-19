
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  setEvents,
  setLoading,
  setError,
  saveEvent,
  removeSavedEvent,
  registerEvent,
  cancelRegistration
} from "../redux/eventsSlice";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const events = useSelector((state) => state.events.events);
  const loading = useSelector((state) => state.events.loading);
  const error = useSelector((state) => state.events.error);
  const savedEvents = useSelector((state) => state.events.savedEvents);
  const registrations = useSelector((state) => state.events.registrations);
  const user = useSelector((state) => state.auth.user);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [upcomingOnly, setUpcomingOnly] = useState(false);

  function getEvents(keyword = "") {
    dispatch(setLoading(true));
    dispatch(setError(""));

    let url =
      "/api/ticketmaster/discovery/v2/events.json?apikey=" +
      import.meta.env.VITE_TICKETMASTER_API_KEY +
      "&size=50";

    if (keyword.trim() !== "") {
      url += "&keyword=" + encodeURIComponent(keyword);
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load events. Please try again.");
        }
        return response.json();
      })
      .then((data) => {
        dispatch(setEvents(data._embedded?.events || []));
      })
      .catch((error) => {
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

  function handleSaveEvent(event) {
    const alreadySaved = savedEvents.some(
      (saved) => saved.id === event.id
    );

    if (alreadySaved) {
      dispatch(removeSavedEvent(event.id));
    } else {
      dispatch(saveEvent(event));
    }
  }

  function handleRegistration(event) {
    if (!user) {
      alert("Please log in to register for an event.");
      navigate("/login");
      return;
    }

    const alreadyRegistered = registrations.some(
      (item) =>
        item.event.id === event.id &&
        item.userEmail === user.email
    );

    if (alreadyRegistered) {
      alert("You are already registered for this event.");
      return;
    }

    dispatch(registerEvent({
      event: event,
      userEmail: user.email
    }));

    alert("Registration successful!");
  }

  function handleCancelRegistration(event) {
    dispatch(cancelRegistration({
      eventId: event.id,
      userEmail: user.email
    }));

    alert("Registration cancelled.");
  }

  const categories = [
    ...new Set(
      events
        .map((event) => event.classifications?.[0]?.segment?.name)
        .filter(Boolean)
    )
  ];

  const today = new Date().toLocaleDateString("en-CA");

  const filteredEvents = events.filter((event) => {
    const eventCategory =
      event.classifications?.[0]?.segment?.name;

    const eventDate = event.dates?.start?.localDate;

    const matchesCategory =
      category === "All" || eventCategory === category;

    const matchesUpcoming =
      !upcomingOnly || !eventDate || eventDate >= today;

    return matchesCategory && matchesUpcoming;
  });

  return (
    <div className="page">
      <h1>Explore Events</h1>
      <p>Search for events and register for the ones you like.</p>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="filters">
        <label>
          Category:
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={upcomingOnly}
            onChange={(e) => setUpcomingOnly(e.target.checked)}
          />
          Show upcoming events
        </label>
      </div>

      {loading && <p>Loading events...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="events">
          {filteredEvents.map((event) => {
            const isSaved = savedEvents.some(
              (saved) => saved.id === event.id
            );

            const isRegistered = user && registrations.some(
              (item) =>
                item.event.id === event.id &&
                item.userEmail === user.email
            );

            return (
              <div className="event-card" key={event.id}>
                {event.images?.length > 0 && (
                  <img src={event.images[0].url} alt={event.name} />
                )}

                <h3>{event.name}</h3>

                <p>
                  Date: {event.dates?.start?.localDate || "Not available"}
                </p>

                <p>
                  Time: {event.dates?.start?.localTime || "Not available"}
                </p>

                <p>
                  Venue: {event._embedded?.venues?.[0]?.name || "Not available"}
                </p>

                <p>
                  Location: {event._embedded?.venues?.[0]?.city?.name || "Not available"}
                </p>

                <p>
                  Category: {event.classifications?.[0]?.segment?.name || "Not available"}
                </p>

                <p>
                  <Link to={`/events/${event.id}`}>View Details</Link>
                </p>

                {event.url && (
                  <p>
                    <a href={event.url} target="_blank" rel="noreferrer">
                      Buy Tickets
                    </a>
                  </p>
                )}

                <button onClick={() => handleSaveEvent(event)}>
                  {isSaved ? "Remove Saved Event" : "Save Event"}
                </button>

                <button
                  onClick={() =>
                    isRegistered
                      ? handleCancelRegistration(event)
                      : handleRegistration(event)
                  }
                >
                  {isRegistered
                    ? "Cancel Registration"
                    : "Register for Event"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && filteredEvents.length === 0 && (
        <p>No events match your search or filters.</p>
      )}
    </div>
  );
}

export default Home;
