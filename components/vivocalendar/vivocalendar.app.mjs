import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "vivocalendar",
  propDefinitions: {
    staffMemberId: {
      type: "string",
      label: "Staff Member ID",
      description: "The unique identifier for the staff member",
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The unique identifier for the customer",
    },
    customerName: {
      type: "string",
      label: "Customer Name",
      description: "The name of the customer",
    },
    customerContact: {
      type: "string",
      label: "Customer Contact",
      description: "The contact information for the customer",
    },
    staffName: {
      type: "string",
      label: "Staff Name",
      description: "The full name of the staff member",
    },
    staffContact: {
      type: "string",
      label: "Staff Contact",
      description: "The contact information for the staff member",
    },
    staffPosition: {
      type: "string",
      label: "Staff Position",
      description: "The position or role of the staff member",
    },
    appointmentId: {
      type: "string",
      label: "Appointment ID",
      description: "The unique identifier for the appointment",
    },
    appointmentDate: {
      type: "string",
      label: "Appointment Date",
      description: "The date of the appointment",
    },
    appointmentTime: {
      type: "string",
      label: "Appointment Time",
      description: "The time of the appointment",
    },
    appointmentNotes: {
      type: "string",
      label: "Appointment Notes",
      description: "Additional details about the appointment",
      optional: true,
    },
    customerEmail: {
      type: "string",
      label: "Customer Email",
      description: "The email address of the customer",
    },
    customerPhoneNumber: {
      type: "string",
      label: "Customer Phone Number",
      description: "The phone number of the customer",
      optional: true,
    },
    customerAddress: {
      type: "string",
      label: "Customer Address",
      description: "The address of the customer",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.vivocalendar.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createCustomer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        data: {
          name: opts.customerName,
          contact: opts.customerContact,
          email: opts.customerEmail,
          phone_number: opts.customerPhoneNumber,
          address: opts.customerAddress,
        },
      });
    },
    async createStaffMember(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/staff",
        data: {
          name: opts.staffName,
          contact: opts.staffContact,
          position: opts.staffPosition,
        },
      });
    },
    async createAppointment(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/appointments",
        data: {
          customer_id: opts.customerId,
          staff_member_id: opts.staffMemberId,
          date: opts.appointmentDate,
          time: opts.appointmentTime,
          notes: opts.appointmentNotes,
        },
      });
    },
    async cancelAppointment(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/appointments/${opts.appointmentId}`,
      });
    },
  },
  version: "0.0.{{ts}}",
};
