import app from "../../cloze.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "cloze-create-update-project",
  name: "Create Or Update Project",
  description: "Create a new project or merge updates into an existing one. [See the documentation](https://api.cloze.com/api-docs/#!/Relations_-_Projects/post_v1_projects_create).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Project Name",
      description: "The name of the project.",
    },
    appLinks: {
      type: "string[]",
      label: "App Links",
      description: "The app links of the project. Each app link should be a JSON object with at least `source` and `uniqueid` keys. [See the documentation](https://api.cloze.com/api-docs/#!/Relations_-_Projects/post_v1_projects_create).",
      optional: true,
      default: [
        JSON.stringify({
          source: "na16.salesforce.com",
          uniqueid: "sdf234v",
        }),
      ],
    },
    summary: {
      type: "string",
      label: "Project Summary",
      description: "The summary of the project.",
      optional: true,
    },
    stage: {
      type: "string",
      label: "Stage",
      description: "The stage of the project.",
      optional: true,
      options: [
        {
          label: "Potential Stage",
          value: "future",
        },
        {
          label: "Active Stage",
          value: "current",
        },
        {
          label: "Won or Done stage",
          value: "won",
        },
        {
          label: "Lost Stage",
          value: "lost",
        },
      ],
    },
    segment: {
      type: "string",
      label: "Segment",
      description: "The segment of the project.",
      optional: true,
      options: [
        "project",
        "project1",
        "project2",
        "project3",
        "project4",
        "project5",
      ],
    },
    additionalData: {
      type: "object",
      label: "Additional Data",
      description: "Additional details for the project in JSON format. [See the documentation](https://api.cloze.com/api-docs/#!/Relations_-_Projects/post_v1_projects_create).",
      optional: true,
    },
  },
  methods: {
    createProject(args = {}) {
      return this.app.post({
        path: "/projects/create",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createProject,
      name,
      appLinks,
      summary,
      stage,
      segment,
      additionalData,
    } = this;

    const response = await createProject({
      $,
      data: {
        name,
        appLinks: utils.parseArray(appLinks),
        summary,
        stage,
        segment,
        ...additionalData,
      },
    });

    $.export("$summary", "Successfully created/updated project.");

    return response;
  },
};
