import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "telnyx",
  propDefinitions: {
    messagingProfileId: {
      type: "string",
      label: "Messaging Profile Id",
      description: "The Id of the messaging profile to use for sending the message.",
      async options({ page }) {
        const params = {
          "page[number]": page + 1,
        };
        const profiles = await this.getMessagingProfiles({
          params,
        });
        return profiles.data.map((profile) => ({
          label: profile.name,
          value: profile.id,
        }));
      },
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number to send the message from.",
      async options({ page }) {
        const params = {
          "page[number]": page + 1,
        };
        const phoneNumbers = await this.getPhoneNumbers({
          params,
        });
        return phoneNumbers.data.map((phoneNumber) => ({
          label: phoneNumber.phone_number,
          value: phoneNumber.phone_number,
        }));
      },
    },
  },
  methods: {
    getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    async makeRequest(customConfig) {
      const {
        $,
        path,
        url,
        ...otherConfig
      } = customConfig;

      const basePath = "https://api.telnyx.com/v2";

      const config = {
        url: url ?? `${basePath}${path}`,
        headers: this.getHeaders(),
        ...otherConfig,
      };
      try {
        return await axios($ || this, config);
      } catch (error) {
        this.throwFormattedError(error);
      }
    },
    throwFormattedError(error) {
      error = error.response;
      throw new Error(`${error.status} - ${error.statusText} - ${error.data.message}`);
    },
    async sendMessage(args) {
      return this.makeRequest({
        method: "POST",
        path: "/messages",
        ...args,
      });
    },
    async getMessagingProfiles(args) {
      return this.makeRequest({
        path: "/messaging_profiles",
        ...args,
      });
    },
    async getPhoneNumbers(args) {
      return this.makeRequest({
        path: "/phone_numbers",
        ...args,
      });
    },
    async getMessage(args) {
      return this.makeRequest({
        path: `/messages/${args.params.id}`,
      });
    },
  },
};
