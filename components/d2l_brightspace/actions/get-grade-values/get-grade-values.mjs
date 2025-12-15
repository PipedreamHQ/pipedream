import app from "../../d2l_brightspace.app.mjs";

export default {
  key: "d2l_brightspace-get-grade-values",
  name: "Get Grade Values",
  description: "Retrieves the grade value for a specific user and grade object from D2L Brightspace. [See the documentation](https://docs.valence.desire2learn.com/res/grade.html)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    orgUnitId: {
      propDefinition: [
        app,
        "orgUnitId",
      ],
    },
    gradeObjectId: {
      propDefinition: [
        app,
        "gradeObjectId",
        (c) => ({
          orgUnitId: c.orgUnitId,
        }),
      ],
    },
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
  },
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
    idempotentHint: true,
  },
  async run({ $ }) {
    const response = await this.app.getGradeValue({
      orgUnitId: this.orgUnitId,
      gradeObjectId: this.gradeObjectId,
      userId: this.userId,
      $,
    });

    $.export("$summary", `Successfully retrieved grade value for user ${this.userId}`);
    return response;
  },
};
