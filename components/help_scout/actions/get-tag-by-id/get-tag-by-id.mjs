import helpScout from "../../help_scout.app.mjs";

export default {
  key: "help_scout-get-tag-by-id",
  name: "Get Tag by ID",
  description: "Gets a tag by its ID. [See the documentation](https://developer.helpscout.com/mailbox-api/endpoints/tags/get/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    helpScout,
    tagId: {
      propDefinition: [
        helpScout,
        "tagId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.helpScout.getTag({
      $,
      tagId: this.tagId,
    });
    $.export("$summary", `Successfully retrieved tag with ID ${this.tagId}`);
    return response;
  },
};
