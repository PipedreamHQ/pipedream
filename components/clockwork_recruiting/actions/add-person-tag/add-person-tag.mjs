import app from "../../clockwork_recruiting.app.mjs";

export default {
  key: "clockwork_recruiting-add-person-tag",
  name: "Add Person Tag",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Add a tag to a specific person. [See the documentation](https://app.swaggerhub.com/apis-docs/clockwork-recruiting/cw-public-api/3.0.0#/Person%20Tags)",
  type: "action",
  props: {
    app,
    personId: {
      propDefinition: [
        app,
        "personId",
      ],
    },
    tagId: {
      propDefinition: [
        app,
        "tagIds",
      ],
      label: "Tag Id",
      description: "The id of the tag you want to add.",
      type: "string",
    },
  },
  async run({ $ }) {
    const {
      app,
      personId,
      tagId,
    } = this;

    const response = await app.addPersonTag({
      $,
      personId,
      data: {
        person_tag: {
          tag_id: tagId,
        },
      },
    });

    $.export("$summary", `Successfully created new tag with ID ${response.personTag?.id}`);
    return response;
  },
};
