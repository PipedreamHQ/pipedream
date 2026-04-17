import app from "../../permit_io.app.mjs";

export default {
  key: "permit_io-remove-role",
  name: "Remove Role",
  description: "Revokes a user's role assignment to instantly offboard them or downgrade their access level. [See the documentation](https://api.permit.io/v2/redoc#tag/Role-Assignments/operation/unassign_role)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
  },
  props: {
    app,
    projId: {
      propDefinition: [
        app,
        "projId",
      ],
    },
    envId: {
      propDefinition: [
        app,
        "envId",
        ({ projId }) => ({
          projId,
        }),
      ],
    },
    role: {
      propDefinition: [
        app,
        "role",
        ({
          projId, envId,
        }) => ({
          projId,
          envId,
        }),
      ],
    },
    user: {
      propDefinition: [
        app,
        "user",
        ({
          projId, envId,
        }) => ({
          projId,
          envId,
        }),
      ],
    },
    tenant: {
      propDefinition: [
        app,
        "tenant",
        ({
          projId, envId,
        }) => ({
          projId,
          envId,
        }),
      ],
    },
    resourceInstance: {
      type: "string",
      label: "Resource Instance",
      description: "The resource instance the role is associated with. Use the format `resource_type:resource_instance_key` (e.g. `repo:opal`).",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      projId,
      envId,
      role,
      user,
      tenant,
      resourceInstance,
    } = this;

    await this.app.removeRole({
      $,
      projId,
      envId,
      data: {
        role,
        user,
        tenant,
        resource_instance: resourceInstance,
      },
    });

    $.export("$summary", `Removed role **${role}** from user **${user}** in tenant **${tenant}**`);
    return {
      success: true,
    };
  },
};
