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
    faxAppId: {
      type: "string",
      label: "Fax Application ID",
      description: "The connection/application ID to send the fax with.",
      async options({ page }) {
        const { data } = await this.listFaxApplications({
          params: {
            "page[number]": page + 1,
          },
        });
        return data?.map(({
          id: value, application_name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    callControlAppId: {
      type: "string",
      label: "Call Control Application ID",
      description: "The ID of the Call Control App to be used when dialing the destination.",
      async options({ page }) {
        const { data } = await this.listCallControlApplications({
          params: {
            "page[number]": page + 1,
          },
        });
        return data?.map(({
          id: value, application_name: label,
        }) => ({
          value,
          label,
        })) || [];
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
      throw new Error(`${error.status} - ${error.statusText} - ${error.data.errors[0].detail}`);
    },
    sendMessage(args = {}) {
      return this.makeRequest({
        method: "POST",
        path: "/messages",
        ...args,
      });
    },
    getMessagingProfiles(args = {}) {
      return this.makeRequest({
        path: "/messaging_profiles",
        ...args,
      });
    },
    getPhoneNumbers(args = {}) {
      return this.makeRequest({
        path: "/phone_numbers",
        ...args,
      });
    },
    listFaxApplications(args = {}) {
      return this.makeRequest({
        path: "/fax_applications",
        ...args,
      });
    },
    listCallControlApplications(args = {}) {
      return this.makeRequest({
        path: "/call_control_applications",
        ...args,
      });
    },
    listWebhookDeliveries(args = {}) {
      return this.makeRequest({
        path: "/webhook_deliveries",
        ...args,
      });
    },
    getMessage({
      id, ...args
    }) {
      return this.makeRequest({
        path: `/messages/${id}`,
        ...args,
      });
    },
    sendGroupMessage(args = {}) {
      return this.makeRequest({
        method: "POST",
        path: "/messages/group_mms",
        ...args,
      });
    },
    sendFax(args = {}) {
      return this.makeRequest({
        method: "POST",
        path: "/faxes",
        ...args,
      });
    },
    dialNumber(args = {}) {
      return this.makeRequest({
        method: "POST",
        path: "/calls",
        ...args,
      });
    },
    async *paginate({
      resourceFn,
      params = {},
      max,
    }) {
      params = {
        ...params,
        "page[number]": 1,
      };
      let hasMore, count = 0;
      do {
        const {
          data, meta,
        } = await resourceFn({
          params,
        });
        for (const item of data) {
          yield item;
          count++;
          if (count >= max) {
            return;
          }
        }
        params["page[number]"] += 1;
        hasMore = count < meta.total_results;
      } while (hasMore);
    },
  },
};
