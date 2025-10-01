import app from "../../giantcampaign.app.mjs";

export default {
  name: "Create Subscriber",
  description: "Create a new subscriber into a list [See the documentation](https://giantcampaign.com/developers/#create-subscriber).",
  key: "giantcampaign-create-subscriber",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    listUid: {
      propDefinition: [
        app,
        "listUid",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the subscriber.",
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the subscriber.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the subscriber.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      list_uid: this.listUid,
      EMAIL: this.email,
      tag: this.tags?.join(","),
      FIRST_NAME: this.firstName,
      LAST_NAME: this.lastName,
    };
    const res = await this.app.createSubscriber(data, $);
    $.export("summary", `Subscriber "${this.email}" successfully created.`);
    return res;
  },
};
