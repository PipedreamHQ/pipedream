import app from "../../easyly.app.mjs";

export default {
  key: "easyly-post-lead",
  name: "Post New Lead",
  description: "Allows a user to post a new lead to their Easyly account. [See the documentation](https://api.easyly.com/posting)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    source: {
      type: "string",
      label: "Source",
      description: "The source unique key. You can get your Source Unique Key by accessing [Settings > Leads > Sources](https://app.easyly.com/settings/leads/sources)",
    },
    fullname: {
      type: "string",
      label: "Full Name",
      description: "The lead contact's full name",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The lead contact's email address",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The lead contact's phone number",
      optional: true,
    },
  },
  methods: {
    postLead(args = {}) {
      return this.app.post({
        path: "/post",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      postLead,
      source,
      fullname,
      email,
      phone,
    } = this;

    const response = await postLead({
      $,
      data: {
        source,
        fullname,
        email,
        phone,
      },
    });

    if (!response?.leadid) {
      throw new Error("Failed to post lead. Maybe the source doesn't exist");
    }

    $.export("$summary", `Successfully posted a new lead with ID: \`${response.leadid}\``);

    return response;
  },
};
