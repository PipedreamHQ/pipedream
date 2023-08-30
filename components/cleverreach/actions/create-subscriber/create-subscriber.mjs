import { axios } from "@pipedream/platform";

export default {
  key: "cleverreach-create-subscriber",
  name: "Create Subscriber",
  description: "Adds a new subscriber to a mailing list. [See docs here](https://rest.cleverreach.com/howto/#basics)",
  version: "0.0.1",
  type: "action",
  props: {
    cleverreach: {
      type: "app",
      app: "cleverreach",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the subscriber to add",
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the mailing list to add the subscriber to",
    },
  },
  methods: {
    async createSubscriber($, email, listId) {
      return axios($, {
        method: "POST",
        url: `https://rest.cleverreach.com/v3/groups.json/${listId}/receivers`,
        headers: {
          Authorization: `Bearer ${this.cleverreach.$auth.api_key}`,
        },
        data: {
          email: email,
        },
      });
    },
  },
  async run({ $ }) {
    const response = await this.createSubscriber($, this.email, this.listId);
    $.export("$summary", "Successfully added subscriber");
    return response;
  },
};
