import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "teach_n_go",
  propDefinitions: {
    courseTitle: {
      type: "string",
      label: "Course Title",
      description: "The title of the course for the class.",
    },
    dateAndTime: {
      type: "string",
      label: "Date and Time",
      description: "The date and time when the class is scheduled.",
    },
    classDescription: {
      type: "string",
      label: "Class Description",
      description: "The optional description of the class.",
      optional: true,
    },
    teacher: {
      type: "string",
      label: "Teacher",
      description: "The optional teacher for the class.",
      optional: true,
    },
    studentName: {
      type: "string",
      label: "Student Name",
      description: "The name of the student involved.",
    },
    amount: {
      type: "number",
      label: "Amount",
      description: "The amount of the payment.",
    },
    paymentMethod: {
      type: "string",
      label: "Payment Method",
      description: "The optional payment method used.",
      optional: true,
    },
    paymentDate: {
      type: "string",
      label: "Payment Date",
      description: "The optional payment date.",
      optional: true,
    },
    dateOfBirth: {
      type: "string",
      label: "Date of Birth",
      description: "The date of birth of the student.",
    },
    contactNumber: {
      type: "string",
      label: "Contact Number",
      description: "The optional contact number of the student.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The optional email of the student.",
      optional: true,
    },
    prospectDetails: {
      type: "object",
      label: "Prospect Details",
      description: "The details of the new prospect.",
    },
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The ID of the invoice to be marked as paid.",
    },
    paidDate: {
      type: "string",
      label: "Paid Date",
      description: "The optional date when the invoice was paid.",
      optional: true,
    },
    personalDetails: {
      type: "object",
      label: "Personal Details",
      description: "The personal details of the new student.",
    },
    academicDetails: {
      type: "object",
      label: "Academic Details",
      description: "The academic details of the new student.",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://app.teachngo.com/api";
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
          "X-API-KEY": this.$auth.api_key,
        },
      });
    },
    async emitNewClassEvent({
      courseTitle, dateAndTime, classDescription, teacher,
    }) {
      // Logic to emit new class created event based on input parameters
    },
    async emitNewPaymentEvent({
      studentName, amount, paymentMethod, paymentDate,
    }) {
      // Logic to emit new payment made event based on input parameters
    },
    async emitNewStudentRegistrationEvent({
      studentName, dateOfBirth, contactNumber, email,
    }) {
      // Logic to emit new student registration event based on input parameters
    },
    async createProspect({ prospectDetails }) {
      return this._makeRequest({
        method: "POST",
        path: "/prospect",
        data: prospectDetails,
      });
    },
    async markInvoiceAsPaid({
      invoiceId, paidDate,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/invoice/${invoiceId}/paid`,
        data: {
          paid_date: paidDate,
        },
      });
    },
    async registerStudent({
      personalDetails, academicDetails,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/student",
        data: {
          personalDetails,
          academicDetails,
        },
      });
    },
  },
};
