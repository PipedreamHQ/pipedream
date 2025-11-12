import app from "../../cleverreach.app.mjs";

export default {
  key: "cleverreach-update-subscriber",
  name: "Update Subscriber",
  description: "Updates the information of an existing subscriber. [See the documentation](https://rest.cleverreach.com/explorer/v3/#!/groups-v3/update__put)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
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
    receiverId: {
      propDefinition: [
        app,
        "receiverId",
        ({ groupId }) => ({
          groupId,
        }),
      ],
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
      groupId,
      receiverId,
      source,
      tags,
      additionalData,
    } = this;
    const response = await this.app.updateSubscriber({
      $,
      groupId,
      receiverId,
      data: {
        source,
        tags,
        ...additionalData,
      },
    });
    $.export("$summary", "Successfully updated subscriber");
    return response;
  },
};
