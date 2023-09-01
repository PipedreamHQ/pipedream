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
      async options({
        page, prevContext,
      }) {
        const { data } = await this.listSubscribers({
          page,
          prevContext,
        });
        return data.map((subscriber) => {
          return {
            label: subscriber.email,
            value: subscriber.id,
          };
        });
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "The new email of the subscriber",
    },
    activated: {
      type: "boolean",
      label: "Activated",
      description: "The new activation status of the subscriber",
      optional: true,
    },
    deactivated: {
      type: "boolean",
      label: "Deactivated",
      description: "The new deactivation status of the subscriber",
      optional: true,
    },
  },
  methods: {
    async listSubscribers({ page }) {
      return axios(this.$, {
        url: "https://rest.cleverreach.com/v3/subscribers.json",
        headers: {
          Authorization: `Bearer ${this.cleverreach.$auth.oauth_access_token}`,
        },
        params: {
          page: page || 1,
        },
      });
    },
    async updateSubscriber(params) {
      return axios(this.$, {
        method: "PUT",
        url: `https://rest.cleverreach.com/v3/subscribers/${params.id}.json`,
        headers: {
          Authorization: `Bearer ${this.cleverreach.$auth.oauth_access_token}`,
        },
        data: {
          email: params.email,
          activated: params.activated,
          deactivated: params.deactivated,
        },
      });
    },
  },
  async run({ $ }) {
    const response = await this.updateSubscriber({
      id: this.subscriber,
      email: this.email,
      activated: this.activated,
      deactivated: this.deactivated,
    });
    $.export("$summary", "Successfully updated subscriber");
    return response;
  },
};
