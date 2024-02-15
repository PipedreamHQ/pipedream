import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "craftboxx",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The unique identifier for the project",
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The unique identifier for the customer",
    },
    customerDetails: {
      type: "object",
      label: "Customer Details",
      description: "The details of the customer including name, email, and address",
    },
    projectDetails: {
      type: "object",
      label: "Project Details",
      description: "The details of the project including project name, description, and customer ID",
    },
    articleTitle: {
      type: "string",
      label: "Article Title",
      description: "The title of the article",
    },
    articleBody: {
      type: "string",
      label: "Article Body",
      description: "The body of the article",
    },
    articleAuthor: {
      type: "string",
      label: "Article Author",
      description: "The author of the article",
    },
    articleTags: {
      type: "string[]",
      label: "Article Tags",
      description: "The tags associated with the article",
      optional: true,
    },
    customerName: {
      type: "string",
      label: "Customer Name",
      description: "The name of the customer",
    },
    customerEmail: {
      type: "string",
      label: "Customer Email",
      description: "The email of the customer",
    },
    customerAddress: {
      type: "string",
      label: "Customer Address",
      description: "The physical address of the customer",
    },
    customerSecondaryAddress: {
      type: "string",
      label: "Customer Secondary Address",
      description: "The secondary address of the customer",
      optional: true,
    },
    projectNumber: {
      type: "string",
      label: "Project Number",
      description: "The number of the project",
    },
    newProjectDetails: {
      type: "object",
      label: "New Project Details",
      description: "The new details for the project",
    },
    appointmentNumber: {
      type: "string",
      label: "Appointment Number",
      description: "The number of the appointment",
    },
    newAppointmentDetails: {
      type: "object",
      label: "New Appointment Details",
      description: "The new details for the appointment",
    },
    optionalNotes: {
      type: "string",
      label: "Optional Notes",
      description: "Any optional notes to add",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.craftboxx.de";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
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
        data,
        params,
      });
    },
    async createCustomer({
      name, email, address, secondaryAddress,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        data: {
          name,
          email,
          address,
          secondaryAddress,
        },
      });
    },
    async createProject({
      projectName, description, customerId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/projects",
        data: {
          name: projectName,
          description,
          customerId,
        },
      });
    },
    async createArticle({
      title, body, author, tags,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/articles",
        data: {
          title,
          body,
          author,
          tags,
        },
      });
    },
    async updateProject({
      projectNumber, newProjectDetails,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/projects/${projectNumber}`,
        data: newProjectDetails,
      });
    },
    async updateAppointment({
      appointmentNumber, newAppointmentDetails, notes,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/appointments/${appointmentNumber}`,
        data: {
          ...newAppointmentDetails,
          notes,
        },
      });
    },
    async updateProjectAndAppointment({
      projectNumber, newProjectDetails, appointmentNumber, newAppointmentDetails, notes,
    }) {
      await this.updateProject({
        projectNumber,
        newProjectDetails,
      });
      return this.updateAppointment({
        appointmentNumber,
        newAppointmentDetails,
        notes,
      });
    },
  },
};
