import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tento8",
  version: "0.0.{{ts}}",
  propDefinitions: {
    time: {
      type: "string",
      label: "Time",
      description: "The ISO datetime string for the appointment time slot.",
      required: true,
    },
    attendeeCount: {
      type: "integer",
      label: "Attendee Count",
      description: "The number of attendees for the appointment.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location resource URI where the appointment will take place.",
      optional: true,
      async options() {
        return this.getLocations();
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://10to8.com/api/booking/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Token ${this.$auth.api_token}`,
        },
      });
    },
    async bookAppointment({
      startDatetime,
      service,
      customerName,
      customerEmail,
      customerPhone,
      customerPhoneCountry,
      customerTimezone,
      staff,
      location,
      attendeeCount,
      answers,
    }) {
      const data = {
        start_datetime: startDatetime,
        service,
        ...(customerName && {
          customer_name: customerName,
        }),
        ...(customerEmail && {
          customer_email: customerEmail,
        }),
        ...(customerPhone && {
          customer_phone_number: customerPhone,
        }),
        ...(customerPhoneCountry && {
          customer_phone_country: customerPhoneCountry,
        }),
        ...(customerTimezone && {
          customer_timezone: customerTimezone,
        }),
        ...(staff && {
          staff,
        }),
        ...(location && {
          location,
        }),
        ...(attendeeCount && {
          attendee_count: attendeeCount,
        }),
        ...(answers && {
          answers,
        }),
      };
      return this._makeRequest({
        method: "POST",
        path: "/book/",
        data,
      });
    },
    async getLocations() {
      const response = await this._makeRequest({
        method: "GET",
        path: "/location/",
      });
      return response.map((location) => ({
        label: location.name,
        value: location.resource_uri,
      }));
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
