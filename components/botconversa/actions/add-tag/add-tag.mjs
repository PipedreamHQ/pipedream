import botconversa from "../../botconversa.app.mjs";

export default {
  key: "botconversa-add-tag",
  name: "Add Tag",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Add tags to a specific subscriber. [See the documentation](https://backend.botconversa.com.br/swagger/)",
  type: "action",
  props: {
    botconversa,
    subscriberId: {
      propDefinition: [
        botconversa,
        "subscriberId",
      ],
      withLabel: true,
    },
    tagId: {
      propDefinition: [
        botconversa,
        "tagId",
      ],
      withLabel: true,
    },
  },
  async run({ $ }) {
    const {
      botconversa,
      subscriberId,
      tagId,
    } = this;

    const response = await botconversa.addTag({
      $,
      subscriberId: subscriberId.value,
      tagId: tagId.value,
    });

    $.export("$summary", `The tag "${tagId.label}" was successfully added to subscriber ${subscriberId.label}!`);
    return response;
  },
};
