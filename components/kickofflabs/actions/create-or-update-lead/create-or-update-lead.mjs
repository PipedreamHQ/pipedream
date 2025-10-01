import app from "../../kickofflabs.app.mjs";

export default {
  name: "Create or Update Lead",
  description: "Adds a new lead or modifies an existing lead on your campaign. [See the documentation](https://dev.kickofflabs.com/create/).",
  key: "kickofflabs-create-or-update-lead",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the lead.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the lead.",
      optional: true,
    },
    ip: {
      type: "string",
      label: "IP Address",
      description: "By default, we use the IP address of the request. This is great if your are using ajax to make the request. However, if you are making the request on the server, you may want to include user’s ip address.",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL which the lead signed up on.",
      optional: true,
    },
    ref: {
      type: "string",
      label: "Referrer URL",
      description: "The referrer url the lead came from.",
      optional: true,
    },
    userAgent: {
      type: "string",
      label: "User Agent",
      description: "The user agent of the lead.",
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "This will default to API, but you can change it to something unique. This is helpful if you are sending leads in from various sources. In additional, if source is API, we will not perform duplicate IP address checks.",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Any additional parameters you include when signing up a lead will be captured as custom fields.",
      optional: true,
    },
  },
  async run({ $ }) {
    const res = await this.app.createOrUpdateLead({
      email: this.email,
      phone_number: this.phoneNumber,
      ip: this.ip,
      __url: this.url,
      __ref: this.ref,
      __user_agent: this.userAgent,
      __source: this.source,
    }, $);
    $.export("summary", `Successfully created or updated lead with id ${res.id}`);
    return res;
  },
};
