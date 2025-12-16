import { ConfigurationError } from "@pipedream/platform";
import app from "../../upsales.app.mjs";

export default {
  key: "upsales-create-user",
  name: "Create User",
  description: "Creates a new user in Upsales. [See the documentation](https://api.upsales.com/#5d393f90-23a3-47fd-a52c-d40a8ae71a83)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the user",
    },
    clientId: {
      type: "integer",
      label: "Client ID",
      description: "The client ID to associate with the user",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The full name of the user",
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language code for the user (e.g., `en-EN`, `sv-SE`)",
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password for the user account",
      secret: true,
    },
    teamLeader: {
      type: "boolean",
      label: "Team Leader",
      description: "Whether the user is a team leader",
      optional: true,
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Whether the user is active",
      optional: true,
      default: true,
    },
    ghost: {
      type: "boolean",
      label: "Ghost",
      description: "Whether the user is a ghost user",
      optional: true,
      default: false,
    },
    export: {
      type: "boolean",
      label: "Export",
      description: "Whether the user can export data",
      optional: true,
    },
    administrator: {
      type: "boolean",
      label: "Administrator",
      description: "Whether the user is an administrator",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      email,
      clientId,
      name,
      language,
      password,
      teamLeader,
      active,
      ghost,
      export: exportProp,
      administrator,
    } = this;

    const response = await this.app.createUser({
      $,
      data: {
        email,
        clientId,
        name,
        language,
        password,
        teamLeader: teamLeader
          ? 1
          : 0,
        active: active
          ? 1
          : 0,
        ghost: ghost
          ? 1
          : 0,
        export: exportProp
          ? 1
          : 0,
        administrator: administrator
          ? 1
          : 0,
      },
    });

    if (response.error) {
      throw new ConfigurationError(`Failed to create user: ${JSON.stringify(response.error)}`);
    }

    $.export("$summary", `Successfully created user with ID: ${response.data.id}`);
    return response.data;
  },
};

