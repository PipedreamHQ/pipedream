import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rejoiner",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Unique identifier for the customer",
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "Unique identifier for the list",
    },
    listSource: {
      type: "string",
      label: "List Source",
      description: "Source context of the list",
      optional: true,
    },
    journeyId: {
      type: "string",
      label: "Journey ID",
      description: "Unique identifier for the journey",
    },
    metadata: {
      type: "string",
      label: "Metadata",
      description: "Additional data relevant to the journey start",
      optional: true,
    },
    profileData: {
      type: "object",
      label: "Profile Data",
      description: "An object containing updated profile attributes",
    },
    updateSource: {
      type: "string",
      label: "Update Source",
      description: "Context for the update",
      optional: true,
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.rejoiner.com";
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
          "Authorization": `Bearer ${this.$auth.api_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    async emitOptOutEvent() {
      return this._makeRequest({
        method: "POST",
        path: "/events/opt-out",
        data: {
          customer_id: this.customerId,
        },
      });
    },
    async addCustomerToList() {
      const data = {
        customer_id: this.customerId,
        list_id: this.listId,
      };
      if (this.listSource) {
        data.list_source = this.listSource;
      }
      return this._makeRequest({
        method: "POST",
        path: "/customers/lists",
        data,
      });
    },
    async triggerCustomerJourney() {
      const data = {
        journey_id: this.journeyId,
        customer_id: this.customerId,
      };
      if (this.metadata) {
        try {
          data.metadata = JSON.parse(this.metadata);
        } catch (error) {
          throw new Error("Invalid JSON format for metadata");
        }
      }
      return this._makeRequest({
        method: "POST",
        path: "/journeys/trigger",
        data,
      });
    },
    async updateCustomerProfile() {
      if (!this.customerId) {
        throw new Error("customer_id is required");
      }
      if (!this.profileData || typeof this.profileData !== "object") {
        throw new Error("profile_data is required and must be an object");
      }
      const data = {
        customer_id: this.customerId,
        profile_data: this.profileData,
      };
      if (this.updateSource) {
        data.update_source = this.updateSource;
      }
      return this._makeRequest({
        method: "PUT",
        path: `/customers/${this.customerId}/profile`,
        data,
      });
    },
  },
  version: "0.0.{{ts}}",
};
