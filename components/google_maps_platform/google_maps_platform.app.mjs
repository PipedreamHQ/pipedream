import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "google_places",
  version: "0.0.{{ts}}",
  propDefinitions: {
    // Required props for searching places
    locationLatitude: {
      type: "number",
      label: "Latitude",
      description: "The latitude of the location to search around.",
    },
    locationLongitude: {
      type: "number",
      label: "Longitude",
      description: "The longitude of the location to search around.",
    },
    // Optional props for searching places
    radius: {
      type: "integer",
      label: "Radius (meters)",
      description: "The radius in meters within which to search for places.",
      optional: true,
    },
    keywords: {
      type: "string",
      label: "Keywords",
      description: "A term to be matched against all content that Google has indexed for this place.",
      optional: true,
    },
    placeType: {
      type: "string",
      label: "Place Type",
      description: "Restricts the results to places matching the specified type.",
      optional: true,
      async options() {
        return [
          {
            label: "Restaurant",
            value: "restaurant",
          },
          {
            label: "Cafe",
            value: "cafe",
          },
          {
            label: "Bar",
            value: "bar",
          },
          {
            label: "Library",
            value: "library",
          },
          {
            label: "Park",
            value: "park",
          },
          // Add more place types as needed
        ];
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the place to search for.",
      optional: true,
    },
    // Required props for retrieving place details
    placeId: {
      type: "string",
      label: "Place ID",
      description: "The unique identifier of the place to retrieve details for.",
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Specific fields to include in the place details response.",
      optional: true,
      options: [
        {
          label: "Address",
          value: "formatted_address",
        },
        {
          label: "Reviews",
          value: "reviews",
        },
        {
          label: "Hours",
          value: "current_opening_hours",
        },
        {
          label: "Phone Number",
          value: "international_phone_number",
        },
        {
          label: "Website",
          value: "website",
        },
        // Add more fields as needed
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://maps.googleapis.com/maps/api/place";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        params: {
          key: this.$auth.api_key,
          ...otherOpts.params,
        },
      });
    },
    async searchPlaces(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/nearbysearch/json",
        ...opts,
      });
    },
    async getPlaceDetails(opts = {}) {
      const {
        placeId, fields, ...otherOpts
      } = opts;
      const params = {};
      if (fields && fields.length > 0) {
        params.fields = fields.join(",");
      }
      return this._makeRequest({
        method: "GET",
        path: "/details/json",
        params: params,
        ...otherOpts,
      });
    },
    async paginate(fn, ...opts) {
      let results = [];
      let nextPageToken = null;

      do {
        const response = await fn({
          ...opts,
          pageToken: nextPageToken,
        });
        results = results.concat(response.results);
        nextPageToken = response.next_page_token;
        if (nextPageToken) {
          // Google Places API requires a short delay before using the nextPageToken
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } while (nextPageToken);

      return results;
    },
  },
};
