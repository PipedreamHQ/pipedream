import heygen from "../../heygen.app.mjs";

export default {
  key: "heygen-create-talking-photo",
  name: "Create Talking Photo",
  description: "Creates a talking photo from a provided image. [See the documentation](https://docs.heygen.com/reference/authentication-1)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    heygen,
    storageKey: {
      propDefinition: [
        heygen,
        "storageKey",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.heygen.createTalkingPhoto(this.storageKey);
    $.export("$summary", `Successfully created talking photo with storage key ${this.storageKey}`);
    return response;
  },
};
