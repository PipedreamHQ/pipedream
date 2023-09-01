import { axios } from "@pipedream/platform";

export default {
  key: "cleverreach-create-subscriber",
  name: "Create Subscriber",
  description:
    "Adds a new subscriber to a mailing list. [See docs here](https://rest.cleverreach.com/howto/#basics)",
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
      description: "The email address of the new subscriber",
    },
    group: {
      type: "string",
      label: "Group",
      description: "The group (mailing list) to add the subscriber to",
      async options() {
        const groups = await this.listGroups();
        return groups.map((group) => ({
          label: group.name,
          value: group.id,
        }));
      },
    },
  },
  methods: {
    async listGroups() {
      return axios(this, {
        url: "https://rest.cleverreach.com/v3/groups",
        headers: {
          Authorization: `Bearer ${this.cleverreach.$auth.oauth_access_token}`,
        },
      });
    },
    createSubscriber({
      $, groupId, email,
    }) {
      return axios($, {
        method: "POST",
        url: `https://rest.cleverreach.com/v3/groups/${groupId}/receivers`,
        headers: {
          Authorization: `Bearer ${this.cleverreach.$auth.oauth_access_token}`,
        },
        data: {
          email,
        },
      });
    },
  },
  async run({ $ }) {
    const response = await this.createSubscriber({
      $,
      groupId: this.group,
      email: this.email,
    });
    $.export(
      "$summary",
      `Successfully added ${this.email} to group ${this.group}`,
    );
    return response;
  },
};
