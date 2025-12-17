import nationbuilder from "../../nationbuilder.app.mjs";

export default {
  key: "nationbuilder-add-tags",
  name: "Add Tags",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Add tags to a specific person. [See the documentation](https://nationbuilder.com/people_api)",
  type: "action",
  props: {
    nationbuilder,
    personId: {
      propDefinition: [
        nationbuilder,
        "personId",
      ],
    },
    tag: {
      propDefinition: [
        nationbuilder,
        "tags",
      ],
    },
  },
  async run({ $ }) {
    const {
      nationbuilder,
      personId,
      tag,
    } = this;

    const response = await nationbuilder.addTags({
      $,
      personId,
      data: {
        tagging: {
          tag,
        },
      },
    });

    $.export("$summary", `Tags were successfully added to the person with Id: ${personId}!`);
    return response;
  },
};
