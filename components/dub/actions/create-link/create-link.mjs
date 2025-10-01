import app from "../../dub.app.mjs";

export default {
  name: "Create Link",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "dub-create-link",
  description: "Creates a link. [See the documentation](https://dub.co/docs/api-reference/endpoint/create-a-new-link)",
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
    const response = await this.app.createLink({
      $,
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

    if (response?.id) {
      $.export("$summary", `Successfully created new link with ID ${response.id}`);
    }

    return response;
  },
};
