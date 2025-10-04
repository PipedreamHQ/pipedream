import app from "../../webvizio.app.mjs";

export default {
  key: "webvizio-create-project",
  name: "Create Project",
  description: "Creates a project in Webvizio. [See the documentation](https://webvizio.com/help-center/incoming-webhooks/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    url: {
      type: "string",
      label: "Project URL",
      description: "The URL of the project to be created.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the project to be created.",
      optional: true,
    },
    screenshot: {
      type: "string",
      label: "Screenshot",
      description: "The screenshot of the project to be created.",
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "The external ID of the project to be created.",
      optional: true,
    },
  },
  methods: {
    createProject(args = {}) {
      return this.app.post({
        path: "/webhook/create-project",
        ...args,
      });
    },
  },
  run({ $: step }) {
    const {
      createProject,
      url,
      name,
      screenshot,
      externalId,
    } = this;

    return createProject({
      step,
      data: {
        url,
        name,
        screenshot,
        externalId,
      },
      summary: (response) => `Successfully created project with ID \`${response.id}\``,
    });
  },
};
