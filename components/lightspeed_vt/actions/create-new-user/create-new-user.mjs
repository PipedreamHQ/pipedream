import lightspeed_vt from "../../lightspeed_vt.app.mjs";

export default {
  key: "lightspeed_vt-create-new-user",
  name: "Create New User",
  description: "Creates a new user in the LightSpeed VT system. [See the documentation](https://lsvtapi.stoplight.io/docs/lsvt-rest-api/26844d671bbcf-create-user)",
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
    userName: {
      propDefinition: [
        lightspeed_vt,
        "userName",
      ],
    },
    password: {
      propDefinition: [
        lightspeed_vt,
        "password",
      ],
    },
    firstName: {
      propDefinition: [
        lightspeed_vt,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        lightspeed_vt,
        "lastName",
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
    const userData = {
      locationId: this.locationId,
      userName: this.userName,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
    };

    const response = await this.lightspeed_vt.createUser(userData);
    $.export("$summary", `Successfully created user ${this.userName}`);
    return response;
  },
};
