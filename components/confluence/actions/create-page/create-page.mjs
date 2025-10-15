import confluence from "../../confluence.app.mjs";

export default {
  key: "confluence-create-page",
  name: "Create Page",
  description: "Creates a new page in the space. [See the documentation](https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-page/#api-pages-post)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    confluence,
    draftInfo: {
      type: "alert",
      alertType: "info",
      content: "Pages are created as published by default, unless specified as a draft in the `Status` prop.",
    },
    spaceId: {
      propDefinition: [
        confluence,
        "spaceId",
      ],
    },
    title: {
      propDefinition: [
        confluence,
        "title",
      ],
      description: "The title of the page",
    },
    body: {
      propDefinition: [
        confluence,
        "body",
      ],
      description: "The body of the page",
    },
    status: {
      propDefinition: [
        confluence,
        "status",
      ],
      description: "The status of the page, specifies if the page will be created as a new page or a draft.",
    },
    parentId: {
      propDefinition: [
        confluence,
        "parentId",
        ({ spaceId }) => ({
          spaceId,
        }),
      ],
      optional: true,
    },
    subtype: {
      type: "string",
      label: "Subtype",
      description: "The subtype of the page",
      optional: true,
      options: [
        "live",
      ],
    },
    embedded: {
      type: "boolean",
      label: "Embedded",
      description: "Whether the page should be embedded",
      optional: true,
    },
    private: {
      type: "boolean",
      label: "Private",
      description: "Whether the page should be private",
      optional: true,
    },
    rootLevel: {
      type: "boolean",
      label: "Root Level",
      description: "Whether the page should be created at the root level",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.confluence.createPage({
      $,
      cloudId: await this.confluence.getCloudId({
        $,
      }),
      data: {
        spaceId: this.spaceId,
        status: this.status,
        title: this.title,
        parentId: this.parentId,
        subtype: this.subtype,
        body: {
          representation: "storage",
          value: this.body,
        },
      },
      params: {
        "embedded": this.embedded,
        "private": this.private,
        "root-level": this.rootLevel,
      },
    });

    $.export("$summary", `Successfully created page with ID: ${response.id}`);
    return response;
  },
};
