import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "appointedd",
  propDefinitions: {
    bookingDetails: {
      type: "object",
      label: "Booking Details",
      description: "Details of the booking",
      optional: true,
    },
    customerDetails: {
      type: "object",
      label: "Customer Details",
      description: "Details of the customer",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.appointedd.com";
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
          Authorization: `Bearer ${this.$auth.access_token}`,
        },
      });
    },
    async createCustomer(customerDetails) {
      return this._makeRequest({
        method: "POST",
        path: "/customer",
        data: customerDetails,
      });
    },
    async getCustomers() {
      return this._makeRequest({
        path: "/customers",
      });
    },
    async getCustomer(customerId) {
      return this._makeRequest({
        path: `/customer/${customerId}`,
      });
    },
    async updateCustomer(customerId, customerDetails) {
      return this._makeRequest({
        method: "PUT",
        path: `/customer/${customerId}`,
        data: customerDetails,
      });
    },
    async deleteCustomer(customerId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/customer/${customerId}`,
      });
    },
    async createBooking(bookingDetails) {
      return this._makeRequest({
        method: "POST",
        path: "/booking",
        data: bookingDetails,
      });
    },
    async getBookings() {
      return this._makeRequest({
        path: "/bookings",
      });
    },
    async updateBooking(bookingId, bookingDetails) {
      return this._makeRequest({
        method: "PUT",
        path: `/booking/${bookingId}`,
        data: bookingDetails,
      });
    },
    async cancelBooking(bookingId) {
      return this._makeRequest({
        method: "POST",
        path: `/booking/${bookingId}/cancel`,
      });
    },
    async updateBookingCustomer(bookingId, customerDetails) {
      return this._makeRequest({
        method: "PUT",
        path: `/booking/${bookingId}/customer`,
        data: customerDetails,
      });
    },
    async cancelBookingCustomer(bookingId) {
      return this._makeRequest({
        method: "POST",
        path: `/booking/${bookingId}/customer/cancel`,
      });
    },
    async createBookingCustomerInvoice(bookingId, invoiceDetails) {
      return this._makeRequest({
        method: "POST",
        path: `/booking/${bookingId}/customer/invoice`,
        data: invoiceDetails,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
