import app from "../../documenterra.app.mjs";

export default {
  key: "documenterra-create-page",
  name: "Create Page",
  description: "Creates a new page. [See the documentation](https://documenterra.ru/docs/user-manual/api-sozdaniye-stranitsy.html)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    id: {
      type: "string",
      label: "Page ID",
      description: "The unique identifier for the page.",
    },
    assigneeUserName: {
      type: "string",
      label: "Assignee User Name",
      description: "Login of the artist to whom the page is assigned.",
    },
    ownerUserName: {
      type: "string",
      label: "Owner User Name",
      description: "The name of the user who is the owner of the page.",
    },
    statusName: {
      type: "string",
      label: "Status Name",
      description: "Page workflow status.",
      options: [
        "Ready",
        "Draft",
        "Under Review",
      ],
    },
    title: {
      type: "string",
      label: "Page Title",
      description: "The title of the page.",
      optional: true,
    },
    bodyHtml: {
      type: "string",
      label: "Body HTML",
      description: "HTML content of the page.",
      optional: true,
    },
    indexKeywords: {
      type: "string[]",
      label: "Index Keywords",
      description: "An array of strings containing keywords to be used when creating the page.",
      optional: true,
    },
  },
  methods: {
    createPage({
      projectId, ...args
    } = {}) {
      return this.app.post({
        path: `/projects/${projectId}/articles`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createPage,
      projectId,
      assigneeUserName,
      id,
      ownerUserName,
      statusName,
      title,
      bodyHtml,
      indexKeywords,
    } = this;

    const response = await createPage({
      $,
      projectId,
      data: {
        assigneeUserName,
        id,
        ownerUserName,
        statusName,
        title,
        bodyHtml,
        indexKeywords,
      },
    });

    $.export("$summary", `Successfully created a new page with ID: \`${response?.id}\`.`);
    return response;
  },
};
