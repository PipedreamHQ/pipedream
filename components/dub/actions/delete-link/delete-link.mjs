import app from "../../dub.app.mjs";

export default {
  name: "Delete Link",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "dub-delete-link",
  description: "Deletes a link. [See the documentation](https://dub.co/docs/api-reference/endpoint/delete-a-link)",
  type: "action",
  props: {
    app,
    projectSlug: {
      type: "string",
      label: "Project slug",
      description: "The slug for the project",
      propDefinition: [
        app,
        "projectSlug",
      ],
    },
    linkId: {
      type: "string",
      label: "Link ID",
      description: "The ID for the link to be deleted",
      propDefinition: [
        app,
        "linkId",
        (c) => ({
          projectSlug: c.projectSlug,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteLink({
      $,
      linkId: this.linkId,
      params: {
        projectSlug: this.projectSlug,
      },
    });

    $.export("$summary", `Successfully deleted link with ID ${this.linkId}`);

    return response;
  },
};
