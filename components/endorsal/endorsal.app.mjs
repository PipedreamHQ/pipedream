import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "endorsal",
  propDefinitions: {
    avatar: {
      type: "string",
      label: "Avatar",
      description: "URL to the image.",
    },
    campaignID: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of the campaign",
      async options() {
        const { data } = await this.listCampaigns();

        return data.map(({
          _id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company of the contact.",
    },
    contact: {
      type: "object",
      label: "Contact",
      description: "The contact details for requesting testimonials",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact. `Email OR phone is required`.",
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location of the contact.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact.",
    },
    position: {
      type: "string",
      label: "Position",
      description: "The position of the contact in the company.",
    },
    testimonial: {
      type: "object",
      label: "Testimonial",
      description: "The details of the testimonial to be created",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.endorsal.io/v1/";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...args,
      });
    },
    listCampaigns() {
      return this._makeRequest({
        path: "autorequests/campaigns",
      });
    },
    createContact(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "contacts",
        ...args,
      });
    },
    createTestimonial(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "testimonials",
        ...args,
      });
    },
    listTestimonials() {
      return this._makeRequest({
        path: "testimonials",
      });
    },
  },
};
