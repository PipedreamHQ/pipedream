import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "letsfg",
  propDefinitions: {
    query: {
      type: "string",
      label: "Query",
      description: "City or airport name to resolve, e.g. `London` or `Heathrow`.",
    },
    origin: {
      type: "string",
      label: "Origin",
      description: "Origin IATA code. City codes expand to every airport in that city, e.g. `LON` covers LHR, LGW, STN, LTN and LCY.",
    },
    destination: {
      type: "string",
      label: "Destination",
      description: "Destination IATA code.",
    },
    departureDate: {
      type: "string",
      label: "Departure Date",
      description: "Departure date in `YYYY-MM-DD` format.",
    },
    returnDate: {
      type: "string",
      label: "Return Date",
      description: "Return date in `YYYY-MM-DD` format. Leave empty for a one-way search.",
      optional: true,
    },
    adults: {
      type: "integer",
      label: "Adults",
      description: "Number of adult passengers or guests.",
      optional: true,
      default: 1,
    },
    hotelText: {
      type: "string",
      label: "Place",
      description: "Place name to resolve to a supplier city id, e.g. `Warsaw`.",
    },
    cityId: {
      type: "integer",
      label: "City ID",
      description: "Supplier city id. Use the **Resolve Hotel City** action and take `Id` from the first result.",
    },
    cityName: {
      type: "string",
      label: "City Name",
      description: "City name as returned by **Resolve Hotel City**, e.g. `Warsaw, Poland`.",
    },
    checkIn: {
      type: "string",
      label: "Check In",
      description: "Check-in date in `YYYY-MM-DD` format.",
    },
    checkOut: {
      type: "string",
      label: "Check Out",
      description: "Check-out date in `YYYY-MM-DD` format.",
    },
    nationality: {
      type: "string",
      label: "Guest Nationality",
      description: "Two-letter country code for the guest. Rates and taxes genuinely differ by nationality, so this changes prices.",
      optional: true,
      default: "PL",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return.",
      optional: true,
      default: 40,
    },
    bookingJobId: {
      type: "string",
      label: "Booking Job ID",
      description: "The `booking_job_id` returned when a hotel booking was started.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://letsfg.co/developers/api/v1";
    },
    _headers() {
      return {
        "X-API-Key": `${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    } = {}) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    resolveLocation({
      query, ...opts
    }) {
      return this._makeRequest({
        path: `/flights/locations/${encodeURIComponent(query)}`,
        ...opts,
      });
    },
    searchFlights(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/flights/search",
        // A flight search fans out across hundreds of airlines and booking
        // sites server-side, so it takes appreciably longer than a typical API
        // call. Left to the platform default it can be cut off mid-search.
        timeout: 1000 * 120,
        ...opts,
      });
    },
    resolveHotelCity(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/hotels/destinations",
        ...opts,
      });
    },
    searchHotels(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/hotels/search",
        // The supplier streams a whole city's inventory and every rate is
        // priced before we answer.
        timeout: 1000 * 240,
        ...opts,
      });
    },
    getHotelBooking({
      bookingJobId, ...opts
    }) {
      return this._makeRequest({
        path: `/hotels/booking/${encodeURIComponent(bookingJobId)}`,
        ...opts,
      });
    },
  },
};
