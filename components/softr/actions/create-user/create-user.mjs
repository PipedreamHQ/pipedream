import softr from "../../softr.app.mjs";
import { axios } from "@pipedream/platform";

export const CreateUser = {
  key: "softr-create-user",
  name: "Create User",
  description: "Creates a new user within a specified Softr app.",
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
      optional: true,
    },
    accessPermissions: {
      propDefinition: [
        softr,
        "accessPermissions",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.softr.createUser({
      appName: this.appName,
      userInfo: this.userInfo,
      userRole: this.userRole,
      accessPermissions: this.accessPermissions,
    });
    $.export("$summary", `Successfully created user in app ${this.appName}`);
    return response;
  },
};

export const RemoveUser = {
  key: "softr-remove-user",
  name: "Remove User",
  description: "Removes a user from a specified Softr app.",
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
    userId: {
      propDefinition: [
        softr,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.softr.removeUser({
      appName: this.appName,
      userId: this.userId,
    });
    $.export("$summary", `Successfully removed user from app ${this.appName}`);
    return response;
  },
};

export const AddUserToDomain = {
  key: "softr-add-user-to-domain",
  name: "Add User to Domain",
  description: "Adds a user to a specified Softr domain.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    softr,
    domainName: {
      propDefinition: [
        softr,
        "domainName",
      ],
    },
    userInfo: {
      propDefinition: [
        softr,
        "userInfo",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.softr.addUserToDomain({
      domainName: this.domainName,
      userInfo: this.userInfo,
    });
    $.export("$summary", `Successfully added user to domain ${this.domainName}`);
    return response;
  },
};
