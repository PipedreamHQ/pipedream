import nationbuilder from "../../nationbuilder.app.mjs";

export default {
  key: "nationbuilder-remove-tags",
  name: "Remove Tags",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Rmove tags from a specific person. [See the documentation](https://nationbuilder.com/people_api)",
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
        "personTags",
        ({ personId }) => ({
          personId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      nationbuilder,
      personId,
      tag,
    } = this;

    const response = await nationbuilder.removeTags({
      $,
      personId,
      data: {
        tagging: {
          tag,
        },
      },
    });

    $.export("$summary", `Tags were successfully removed from the person with Id: ${personId}!`);
    return response;
  },
};
