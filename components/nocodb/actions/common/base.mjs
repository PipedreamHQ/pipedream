import nocodb from "../../nocodb.app.mjs";

export default {
  type: "action",
  props: {
    nocodb,
    projectId: {
      propDefinition: [
        nocodb,
        "projectId",
      ],
    },
    tableName: {
      propDefinition: [
        nocodb,
        "tableName",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.processEvent();
    $.export("$summary", this.getSummary(response));
    return response;
  },
};
