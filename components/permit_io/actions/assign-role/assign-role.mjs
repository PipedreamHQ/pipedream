import app from "../../permit_io.app.mjs";

export default {
  key: "permit_io-assign-role",
  name: "Assign Role",
  description: "Grants a specific role to a user within a tenant to enable immediate access to protected resources. [See the documentation](https://api.permit.io/v2/redoc#tag/Role-Assignments/operation/assign_role)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
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
      optional: true,
    },
    resourceInstance: {
      type: "string",
      label: "Resource Instance",
      description: "The resource instance the role is associated with. Use the format `resource_type:resource_instance_key` (e.g. `repo:opal`). The instance will be implicitly created if `Tenant` is specified and it does not exist.",
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

    const response = await this.app.assignRole({
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

    $.export("$summary", `Assigned role **${role}** to user **${user}**${tenant
      ? ` in tenant **${tenant}**`
      : ""}`);
    return response;
  },
};
