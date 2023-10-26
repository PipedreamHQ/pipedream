import lightspeed_vt from "../../lightspeed_vt.app.mjs";

export default {
  key: "lightspeed_vt-create-new-user",
  name: "Create New User",
  description: "Creates a new user in the Lightspeed VT system. [See the documentation](https://lsvtapi.stoplight.io/docs/lsvt-rest-api/26844d671bbcf-create-user)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    lightspeed_vt,
    locationId: {
      propDefinition: [
        lightspeed_vt,
        "locationId",
      ],
    },
    username: {
      propDefinition: [
        lightspeed_vt,
        "username",
      ],
    },
    password: {
      propDefinition: [
        lightspeed_vt,
        "password",
      ],
    },
    email: {
      propDefinition: [
        lightspeed_vt,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lightspeed_vt.createUser({
      locationId: this.locationId,
      username: this.username,
      password: this.password,
      email: this.email,
    });
    $.export("$summary", `Successfully created user with username: ${this.username}`);
    return response;
  },
};
