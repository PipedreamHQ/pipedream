import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "endorsal",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of the campaign",
      async options() {
        const campaigns = await this.listCampaigns();
        return campaigns.map((campaign) => ({
          value: campaign.id,
          label: campaign.name,
        }));
      },
    },
    contact: {
      type: "object",
      label: "Contact",
      description: "The contact details for requesting testimonials",
    },
    testimonial: {
      type: "object",
      label: "Testimonial",
      description: "The details of the testimonial to be created",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.endorsal.io";
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
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async listCampaigns() {
      const campaigns = await this._makeRequest({
        path: "/campaigns",
      });
      return campaigns;
    },
    async createContact(contact) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        data: contact,
      });
    },
    async createTestimonial(testimonial) {
      return this._makeRequest({
        method: "POST",
        path: "/testimonials",
        data: testimonial,
      });
    },
    async getTestimonials() {
      const testimonials = await this._makeRequest({
        path: "/testimonials",
      });
      return testimonials;
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
