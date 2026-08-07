import app from "../../d2l_brightspace.app.mjs";

export default {
  key: "d2l_brightspace-create-enrollment",
  name: "Create Enrollment",
  description: "Enrolls a user in a course on D2L Brightspace. [See the documentation](https://docs.valence.desire2learn.com/res/enroll.html)",
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
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    roleId: {
      propDefinition: [
        app,
        "roleId",
      ],
    },
  },
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
    idempotentHint: false,
  },
  async run({ $ }) {
    const response = await this.app.createEnrollment({
      data: {
        OrgUnitId: this.orgUnitId,
        UserId: this.userId,
        RoleId: this.roleId,
      },
      $,
    });

    $.export("$summary", `Successfully enrolled user ${this.userId} in course ${this.orgUnitId}`);
    return response;
  },
};
