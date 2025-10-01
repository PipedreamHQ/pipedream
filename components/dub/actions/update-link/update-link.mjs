import app from "../../dub.app.mjs";

export default {
  name: "Update Link",
  version: "0.0.8",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "dub-update-link",
  description: "Updates a link. [See the documentation](https://dub.co/docs/api-reference/endpoint/edit-a-link)",
  type: "action",
  props: {
    app,
    projectSlug: {
      type: "string",
      label: "Project slug",
      description: "The slug for the project to create links for",
      propDefinition: [
        app,
        "projectSlug",
      ],
    },
    linkId: {
      type: "string",
      label: "Link ID",
      description: "The slug for the project to create links for",
      propDefinition: [
        app,
        "linkId",
        (c) => ({
          projectSlug: c.projectSlug,
        }),
      ],
    },
    domain: {
      propDefinition: [
        app,
        "domain",
        (c) => ({
          projectSlug: c.projectSlug,
        }),
      ],
    },
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
    password: {
      propDefinition: [
        app,
        "password",
      ],
      optional: true,
    },
    publicStats: {
      propDefinition: [
        app,
        "publicStats",
      ],
    },
    comments: {
      propDefinition: [
        app,
        "comments",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.updateLink({
      $,
      linkId: this.linkId,
      params: {
        projectSlug: this.projectSlug,
      },
      data: {
        domain: this.domain,
        url: this.url,
        password: this.password,
        publicStats: this.publicStats,
        comments: this.comments,
      },
    });

    $.export("$summary", `Successfully updated link with ID ${this.linkId}`);

    return response;
  },
};
