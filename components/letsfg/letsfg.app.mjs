import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "letsfg",
  propDefinitions: {
    origin: {
      type: "string",
      label: "Origin",
      description: "Origin IATA code. City codes expand to every airport in that city, e.g. `LON` covers LHR, LGW, STN, LTN and LCY.",
    },
    destination: {
      type: "string",
      label: "Destination",
      description: "Destination IATA code, e.g. `BCN` or `NYC`.",
    },
    dateFrom: {
      type: "string",
      label: "Departure Date",
      description: "Departure date in `YYYY-MM-DD` format.",
    },
    returnFrom: {
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
    children: {
      type: "integer",
      label: "Children",
      description: "Number of child passengers.",
      optional: true,
      default: 0,
    },
    cabinClass: {
      type: "string",
      label: "Cabin Class",
      description: "Preferred cabin.",
      optional: true,
      options: [
        {
          label: "Economy",
          value: "M",
        },
        {
          label: "Premium Economy",
          value: "W",
        },
        {
          label: "Business",
          value: "C",
        },
        {
          label: "First",
          value: "F",
        },
      ],
    },
    hotelText: {
      type: "string",
      label: "Place",
      description: "Place name to resolve to a supplier city id, e.g. `Warsaw`.",
    },
    city: {
      type: "string",
      label: "City",
      description: "Start typing a place name to search. The supplier needs both an id and a name, so the value carries both as `id|Name` — you can also enter that form directly, e.g. `148614|Warsaw, Poland`.",
      async options({ query }) {
        if (!query) {
          return [];
        }
        const { results = [] } = await this.resolveHotelCity({
          data: {
            text: query,
          },
        });
        return results.map(({
          Id: id, Name: name,
        }) => ({
          label: name,
          value: `${id}|${name}`,
        }));
      },
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
    /**
     * Search flights across hundreds of airlines and the major booking sites.
     *
     * @param {object} opts - Request options.
     * @param {object} opts.data - Search body: `origin`, `destination`,
     * `date_from`, and optionally `return_from`, `adults`, `children`,
     * `cabin_class`.
     * @returns {Promise<object>} `search_id`, `offers[]`, `total_results`,
     * `airlines_summary`.
     */
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
    /**
     * Resolve a place name to the supplier city id hotel search needs.
     *
     * @param {object} opts - Request options.
     * @param {object} opts.data - Body with `text`, the place name.
     * @returns {Promise<object>} `results[]`, each with `Id` and `Name`.
     */
    resolveHotelCity(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/hotels/destinations",
        ...opts,
      });
    },
    /**
     * Search bookable hotel inventory. Only free-cancellation, pay-later rates
     * are returned, so every result can actually be booked on those terms.
     *
     * @param {object} opts - Request options.
     * @param {object} opts.data - Search body: `city_id`, `city_name`,
     * `check_in`, `check_out`, and optionally `adults`, `nationality`, `limit`.
     * @returns {Promise<object>} `session_id`, `currency`, `count`, `hotels[]`.
     */
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
    /**
     * Retrieve a hotel booking by the job id returned when it was started.
     *
     * @param {object} opts - Request options.
     * @param {string} opts.bookingJobId - The `booking_job_id` to look up.
     * @returns {Promise<object>} `status`, and once settled `confirmation`,
     * `reservation_fee_charged`, `pay_link`, `balance_due`, `balance_due_by`.
     */
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
