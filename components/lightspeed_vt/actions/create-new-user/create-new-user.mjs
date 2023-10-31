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
    accessLevel: {
      propDefinition: [
        lightspeed_vt,
        "accessLevel",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lightspeed_vt.createUser({
      method: "POST",
      data: {
        locationId: this.locationId,
        username: this.username,
        password: this.password,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        accessLevel: this.accessLevel,
      },
    });
    $.export("$summary", `Successfully created new user with ID: ${response.userId}`);
    return response;
  },
};
