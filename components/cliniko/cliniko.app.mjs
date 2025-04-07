import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "cliniko",
  propDefinitions: {
    patientId: {
      type: "string",
      label: "Patient ID",
      description: "Enter a unique patient ID.",
      async options({
        page, prevContext: { hasNext },
      }) {
        if (hasNext === false) {
          return [];
        }
        const {
          links: { next },
          patients,
        } = await this.listPatients({
          params: {
            page: page + 1,
            sort: "created_at:desc",
          },
        });
        const options = patients.map(({
          id: value, first_name: firstName, last_name: lastName, email,
        }) => ({
          label: [
            firstName,
            lastName,
            email,
          ].join(" ").trim(),
          value,
        }));
        return {
          options,
          context: {
            hasNext: !!next,
          },
        };
      },
    },
  },
  methods: {
    /**
     * Get the Cliniko API key for the authenticated user.
     * @returns {String} The Cliniko API key.
     */
    _apiKey() {
      return this.$auth.api_key;
    },
    _shard() {
      return this.$auth.shard;
    },
    getUrl(path) {
      const baseUrl = constants.BASE_URL.replace(constants.SHARD_PLACEHOLDER, this._shard());
      return `${baseUrl}${constants.VERSION_PATH}${path}`;
    },
    getAuth() {
      return {
        username: this._apiKey(),
        password: "",
      };
    },
    getHeaders(headers) {
      // Cliniko requires contact email address in User-Agent header.
      // See https://github.com/redguava/cliniko-api#identifying-your-application.
      return {
        ...headers,
        "Accept": "application/json",
        "User-Agent": "Pipedream (support@pipedream.com)",
      };
    },
    makeRequest({
      $ = this, path, headers, ...args
    }) {
      const config = {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
        auth: this.getAuth(),
      };
      return axios($, config);
    },
    listPatients(args = {}) {
      return this.makeRequest({
        path: "/patients",
        ...args,
      });
    },
    listContacts(args = {}) {
      return this.makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    listBookings(args = {}) {
      return this.makeRequest({
        path: "/bookings",
        ...args,
      });
    },
    listAppointments(args = {}) {
      return this.makeRequest({
        path: "/appointments",
        ...args,
      });
    },
  },
};
