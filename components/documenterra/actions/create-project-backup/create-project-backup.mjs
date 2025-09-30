import app from "../../documenterra.app.mjs";

export default {
  key: "documenterra-create-project-backup",
  name: "Create Project Backup",
  description: "Creates a backup of a project. [See the documentation](https://documenterra.ru/docs/user-manual/api-sozdaniye-rezervnoy-kopii-proyekta.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    outputFileName: {
      propDefinition: [
        app,
        "outputFileName",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      projectId,
      outputFileName,
    } = this;

    const response = await app.createProject({
      $,
      projectId,
      params: {
        action: "download",
      },
      data: {
        outputFileName,
      },
    });

    $.export("$summary", `Successfully created project backup with taskKey: \`${response?.taskKey}\`.`);
    return response;
  },
};
