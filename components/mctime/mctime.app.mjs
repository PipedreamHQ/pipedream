import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mctime",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
    },
    dateTime: {
      type: "string",
      label: "Date and Time",
      description: "Provide date and time in ISO-8601 format containing a timezone, eg. 2022-04-25T08:00:00+03:00",
    },
    action: {
      type: "string",
      label: "Action",
      description: "The action to perform on the clocking time entry",
      options: [
        "start",
        "break",
        "stop",
        "cancel",
        "update",
      ],
    },
    timeType: {
      type: "string",
      label: "Time Type",
      description: "The type of the time entry",
      options: [
        "work",
        "parental_leave",
        "worked_rest_period",
        "clocking",
        "statutory_leave",
        "public_holiday_abroad",
        "medical_leave",
        "bad_weather",
        "company_vacation",
        "unpaid_vacation",
        "care_leave",
        "out_office",
        "work_accident_sickness",
        "military_exercize",
        "flextime",
        "unpaid_time_off",
        "home_office",
        "study_leave",
        "paid_time_off",
        "other_leave",
        "vacation_abroad",
        "travel",
        "sick",
        "military_service",
        "jubilee_day",
        "vacation",
        "move",
        "special_leave",
        "free_time",
      ],
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "A comment for the time entry",
      optional: true,
    },
    organizationName: {
      type: "string",
      label: "Organization Name",
      description: "The name of the organization for the time entry",
      optional: true,
    },
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization for the time entry",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://mctime.com/api/v2/auth";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        data,
        headers: {
          ...headers,
          "API_KEY": this.$auth.api_key,
        },
      });
    },
    async createTimeEntry(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/times",
        ...opts,
      });
    },
    async manipulateClockingTime(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/clock",
        ...opts,
      });
    },
    async getTimeEntries(opts = {}) {
      return this._makeRequest({
        path: "/times",
        ...opts,
      });
    },
  },
};
