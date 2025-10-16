import app from "../../teamwork.app.mjs";

export default {
  type: "action",
  key: "teamwork-list-project-tasks",
  name: "List Project Tasks",
  description: "List tasks from a project. [See the docs here](https://apidocs.teamwork.com/docs/teamwork/6e3da2c04d779-get-all-tasks-on-a-given-project)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    completeAfterDate: {
      type: "string",
      label: "Complete After Date",
      description: "Only return tasks that are complete after this date. Format: YYYYMMDDHHMMSS",
      optional: true,
    },
    completeBeforeDate: {
      type: "string",
      label: "Complete Before Date",
      description: "Only return tasks that are complete before this date. Format: YYYYMMDDHHMMSS",
      optional: true,
    },
    creatorsId: {
      propDefinition: [
        app,
        "peopleId",
      ],
      type: "string[]",
      label: "Creators Id",
      description: "Only return tasks that were created by these people.",
      optional: true,
    },
    showDeleted: {
      type: "boolean",
      label: "Show Deleted",
      description: "Show deleted tasks.",
      optional: true,
    },
  },
  async run({ $ }) {
    const PAGE_SIZE = 250;
    let page = 1;

    let data = [];
    do {
      const params = {
        page,
        "pageSize": PAGE_SIZE,
        "completedAfterDate": this.completeAfterDate,
        "completedBeforeDate": this.completeBeforeDate,
        "creator-ids": this.creatorsId?.join(","),
        "showDeleted": this.showDeleted,
      };
      const res = await this.app.listProjectTasks(
        this.projectId,
        params,
        $,
      );
      data = data.concat(res);

      if (res.length < PAGE_SIZE) {
        break;
      }
      page++;
    } while (true);

    $.export("$summary", "Tasks successfully listed");
    return data;
  },
};
