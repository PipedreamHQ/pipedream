import { axios } from "@pipedream/platform";

export default {
  key: "cleverreach-update-subscriber",
  name: "Update Subscriber",
  description: "Updates the information of an existing subscriber. [See docs here](https://rest.cleverreach.com/howto/#basics)",
  version: "0.0.1",
  type: "action",
  props: {
    cleverreach: {
      type: "app",
      app: "cleverreach",
    },
    subscriber: {
      type: "string",
      label: "Subscriber",
      async options() {
        const response = await this.listSubscribers();
        return response.data.map((subscriber) => {
          return {
            label: subscriber.email,
            value: subscriber.id,
          };
        });
      },
    },
    updatedData: {
      type: "object",
      label: "Updated Data",
      description: "The updated data for the subscriber",
    },
  },
  methods: {
    async listSubscribers() {
      return axios(this, {
        method: "GET",
        url: "https://rest.cleverreach.com/v3/contacts.json",
        headers: {
          Authorization: `Bearer ${this.cleverreach.$auth.oauth_access_token}`,
        },
      });
    },
    async updateSubscriber(subscriberId, data) {
      return axios(this, {
        method: "PUT",
        url: `https://rest.cleverreach.com/v3/contacts/${subscriberId}.json`,
        headers: {
          Authorization: `Bearer ${this.cleverreach.$auth.oauth_access_token}`,
        },
        data: data,
      });
    },
  },
  async run({ $ }) {
    const response = await this.updateSubscriber(this.subscriber, this.updatedData);
    $.export("$summary", "Successfully updated subscriber");
    return response;
  },
};
