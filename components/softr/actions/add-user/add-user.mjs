import softr from "../../softr.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "softr-add-user",
  name: "Add User",
  description: "Adds a new user to a specified softr.io domain. [See the documentation](https://docs.softr.io)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    softr,
    appName: {
      propDefinition: [
        softr,
        "appName",
      ],
    },
    userInfo: {
      propDefinition: [
        softr,
        "userInfo",
      ],
    },
    userRole: {
      propDefinition: [
        softr,
        "userRole",
      ],
    },
    accessPermissions: {
      propDefinition: [
        softr,
        "accessPermissions",
      ],
    },
    domainName: {
      propDefinition: [
        softr,
        "domainName",
      ],
    },
  },
  async run({ $ }) {
    const userCreationResponse = await this.softr.createUser({
      appName: this.appName,
      userInfo: this.userInfo,
      userRole: this.userRole,
      accessPermissions: this.accessPermissions,
    });

    if (userCreationResponse.status == 200) {
      const userAdditionResponse = await this.softr.addUserToDomain({
        domainName: this.domainName,
        userInfo: this.userInfo,
      });

      if (userAdditionResponse.status == 200) {
        $.export("$summary", "User added successfully");
        return userAdditionResponse;
      } else {
        $.export("$summary", "Failed to add user to domain");
        throw new Error(userAdditionResponse.data.message);
      }
    } else {
      $.export("$summary", "Failed to create user");
      throw new Error(userCreationResponse.data.message);
    }
  },
};
