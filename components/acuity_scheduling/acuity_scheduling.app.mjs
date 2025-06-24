import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "acuity_scheduling",
  propDefinitions: {
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The starting time to block off (e.g., '2023-01-01T00:00:00Z').",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The ending time of the blocked off period (e.g., '2023-01-01T01:00:00Z').",
    },
    appointmentTypeId: {
      type: "string",
      label: "Appointment Type ID",
      description: "Show only appointments of this type.",
      async options() {
        const data = await this.listAppointmentTypes();

        return data.filter((item) => item.active).map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    calendarId: {
      type: "string",
      label: "Calendar ID",
      description: "Show only appointments on calendar with specified ID.",
      async options() {
        const data = await this.listCalendars();

        return data.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    certificate: {
      type: "string",
      label: "Certificate",
      description: "Package or coupon certificate code",
      async options({ appointmentTypeId }) {
        const certificates = await this.listCertificates({
          params: {
            appointmentTypeID: appointmentTypeId,
          },
        });

        return certificates?.map(({
          name: label, certificate: value,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    labelId: {
      type: "string",
      label: "Label ID",
      description: "Label to be added to the appointment",
      async options() {
        const labels = await this.listLabels();

        return labels?.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    formId: {
      type: "string",
      label: "Form ID",
      description: "Enter form fields for the appointment. [See the documentation](https://developers.acuityscheduling.com/reference/post-appointments#setting-forms) for more information on setting form fields.",
      async options() {
        const forms = await this.listForms();

        return forms?.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "Timezone of the client. E.g. `America/Los_Angeles`",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://acuityscheduling.com/api/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: this._headers(),
      });
    },
    listAppointmentTypes(opts = {}) {
      return this._makeRequest({
        path: "/appointment-types",
        ...opts,
      });
    },
    listCalendars() {
      return this._makeRequest({
        path: "/calendars",
      });
    },
    listAppointments(opts = {}) {
      return this._makeRequest({
        path: "/appointments",
        ...opts,
      });
    },
    listCertificates(opts = {}) {
      return this._makeRequest({
        path: "/certificates",
        ...opts,
      });
    },
    listLabels(opts = {}) {
      return this._makeRequest({
        path: "/labels",
        ...opts,
      });
    },
    listForms(opts = {}) {
      return this._makeRequest({
        path: "/forms",
        ...opts,
      });
    },
    listProducts(opts = {}) {
      return this._makeRequest({
        path: "/products",
        ...opts,
      });
    },
    getAppointment({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/appointments/${id}`,
        ...opts,
      });
    },
    getAvailabilityTimes(opts = {}) {
      return this._makeRequest({
        path: "/availability/times",
        ...opts,
      });
    },
    checkAvailabilityTimes(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/availability/check-times",
        ...opts,
      });
    },
    blockTime(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/blocks",
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteHook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
    createAppointment(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/appointments",
        ...opts,
      });
    },
  },
};
