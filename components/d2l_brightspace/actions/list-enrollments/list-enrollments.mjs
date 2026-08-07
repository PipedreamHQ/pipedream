import app from "../../d2l_brightspace.app.mjs";

export default {
  key: "d2l_brightspace-list-enrollments",
  name: "List Enrollments",
  description: "Retrieves a list of enrollments for a specific course from D2L Brightspace. [See the documentation](https://docs.valence.desire2learn.com/res/enroll.html)",
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
    roleId: {
      propDefinition: [
        app,
        "roleId",
      ],
      optional: true,
      description: "Filter enrollments by role (optional)",
    },
    max: {
      type: "integer",
      label: "Maximum Results",
      description: "The maximum number of enrollments to return",
      optional: true,
      default: 100,
    },
  },
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
    idempotentHint: true,
  },
  async run({ $ }) {
    const enrollments = [];

    const params = {};
    if (this.roleId) {
      params.roleId = this.roleId;
    }

    const iterator = this.app.paginate({
      fn: this.app.listEnrollmentsByOrgUnit,
      params: {
        orgUnitId: this.orgUnitId,
        ...params,
      },
      maxResults: this.max,
    });

    for await (const enrollment of iterator) {
      enrollments.push(enrollment);
    }

    $.export("$summary", `Successfully retrieved ${enrollments.length} enrollment${enrollments.length === 1
      ? ""
      : "s"}`);
    return enrollments;
  },
};
