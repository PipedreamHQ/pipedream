import ramp from "../../ramp.app.mjs";

export default {
  key: "ramp-create-user-invite",
  name: "Create User Invite",
  description: "Sends out an invite for a new user. [See the documentation](https://docs.ramp.com/developer-api/v1/overview/getting-started)",
  version: "0.0.1",
  type: "action",
  props: {
    ramp,
    departmentId: {
      propDefinition: [
        ramp,
        "departmentId",
      ],
      optional: true,
    },
    directManagerId: {
      propDefinition: [
        ramp,
        "directManagerId",
      ],
      optional: true,
    },
    locationId: {
      propDefinition: [
        ramp,
        "locationId",
      ],
      optional: true,
    },
    role: {
      propDefinition: [
        ramp,
        "role",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ramp.inviteUser({
      departmentId: this.departmentId,
      directManagerId: this.directManagerId,
      locationId: this.locationId,
      role: this.role,
    });
    $.export("$summary", `Invite sent successfully to new user with role ${this.role}`);
    return response;
  },
};
