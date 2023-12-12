import pushbullet from "../../pushbullet.app.mjs";

export default {
  name: "Delete push",
  version: "0.0.1",
  key: "pushbullet-delete-push",
  description: "Delete a push. [See docs here](https://docs.pushbullet.com/#delete-push)",
  type: "action",
  props: {
    pushbullet,
    pushIden: {
      propDefinition: [
        pushbullet,
        "push",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pushbullet.deletePush({
      pushIden: this.pushIden,
      $,
    });

    $.export("$summary", `Successfully deleted push ${this.pushIden}`);

    return response;
  },
};
