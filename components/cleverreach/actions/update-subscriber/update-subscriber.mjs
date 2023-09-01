import app from "../../cleverreach.app.mjs";

export default {
  key: "cleverreach-update-subscriber",
  name: "Update Subscriber",
  description: "Updates the information of an existing subscriber. [See docs here](https://rest.cleverreach.com/howto/#basics)",
  version: "0.0.1",
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
      ],
    },
    receiverData: {
      propDefinition: [
        app,
        "receiverData",
      ],
    },
  },
  async run({ $ }) {
    const {
      groupId, receiverId, receiverData,
    } = this;
    const response = await this.app.updateSubscriber({
      $,
      groupId,
      receiverId,
      receiverData,
    });
    $.export("$summary", "Successfully updated subscriber");
    return response;
  },
};
