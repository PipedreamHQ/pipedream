import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "vivocalendar",
  propDefinitions: {
    customerName: {
      type: "string",
      label: "Customer Name",
      description: "The name of the customer",
    },
    customerEmail: {
      type: "string",
      label: "Customer Email",
      description: "The email address of the customer",
      optional: true,
    },
    customerPhone: {
      type: "string",
      label: "Customer Phone Number",
      description: "The phone number of the customer",
      optional: true,
    },
    customerBirthDate: {
      type: "string",
      label: "Customer Date of Birth",
      description: "The date of birth of the customer",
      optional: true,
    },
    customerHobby: {
      type: "string",
      label: "Customer Hobby",
      description: "The hobby of the customer",
      optional: true,
    },
    staffUserId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier for the user",
      async options({
        mapper = ({
          id: value, name: label,
        }) => ({
          label,
          value,
        }),
      }) {
        const { response: { staff_members: users } } = await this.listStaffUsers();
        return users.map(mapper);
      },
    },
    serviceId: {
      type: "string",
      label: "Service ID",
      description: "The unique identifier for the service",
      async options() {
        const { response: { services } } = await this.listServices();
        return services.map(({
          id: value, service_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    appointmentStartTime: {
      type: "string",
      label: "Appointment Start Time",
      description: "The start time of the appointment. Eg `16:30`",
    },
    appointmentDate: {
      type: "string",
      label: "Appointment Date",
      description: "The date of the appointment. Eg `2024-01-01`",
    },
    appointmentEndTime: {
      type: "string",
      label: "Appointment End Time",
      description: "The end time of the appointment. Eg `17:30`",
    },
    appointmentId: {
      type: "string",
      label: "Appointment ID",
      description: "The unique identifier for the appointment",
      async options({
        page, email,
      }) {
        const { response: { appointment } } = await this.listAppointments({
          params: {
            page,
            email,
          },
        });
        return appointment.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "accept": "application/json",
        "api-key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    listStaffUsers(args = {}) {
      return this._makeRequest({
        path: "/staff_members",
        ...args,
      });
    },
    listServices(args = {}) {
      return this._makeRequest({
        path: "/services",
        ...args,
      });
    },
    listAppointments(args = {}) {
      return this._makeRequest({
        path: "/appointments",
        ...args,
      });
    },
  },
};
