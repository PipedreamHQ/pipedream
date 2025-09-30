import reflect from "../../reflect.app.mjs";

export default {
  key: "reflect-create-link",
  name: "Create Link",
  description: "Create a new link. [See the documentation](https://openpm.ai/apis/reflect#/graphs/{graphId}/links)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    reflect,
    graphId: {
      propDefinition: [
        reflect,
        "graphId",
      ],
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the link to create",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The link title",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The link description",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.reflect.createLink({
      graphId: this.graphId,
      data: {
        url: this.url,
        title: this.title,
        description: this.description,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created new link with ID ${response.id}`);
    }

    return response;
  },
};
