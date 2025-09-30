import app from "../../cleverreach.app.mjs";

export default {
  key: "cleverreach-create-subscriber",
  name: "Create Subscriber",
  description:
    "Adds a new subscriber to a mailing list. [See the documentation](https://rest.cleverreach.com/explorer/v3/#!/groups-v3/create__post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    groupId: {
      propDefinition: [
        app,
        "groupId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the new subscriber",
    },
    source: {
      propDefinition: [
        app,
        "source",
      ],
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
    },
    additionalData: {
      propDefinition: [
        app,
        "additionalData",
      ],
    },
  },
  async run({ $ }) {
    const {
      email,
      groupId,
      source,
      tags,
      additionalData,
    } = this;
    const response = await this.app.createSubscriber({
      $,
      groupId,
      data: {
        email,
        source,
        tags,
        ...additionalData,
      },
    });
    $.export(
      "$summary",
      `Successfully added ${email} to group ${groupId}`,
    );
    return response;
  },
};
