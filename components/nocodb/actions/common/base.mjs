import nocodb from "../../nocodb.app.mjs";

export default {
  type: "action",
  props: {
    nocodb,
    workspaceId: {
      propDefinition: [
        nocodb,
        "workspaceId",
      ],
    },
    projectId: {
      propDefinition: [
        nocodb,
        "projectId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    tableId: {
      propDefinition: [
        nocodb,
        "tableId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.processEvent($);
    $.export("$summary", this.getSummary(response));
    return response;
  },
};
