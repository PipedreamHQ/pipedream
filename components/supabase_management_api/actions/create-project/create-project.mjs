import supabaseManagementApi from "../../supabase_management_api.app.mjs";

export default {
  key: "supabase_management_api-create-project",
  name: "Create Project",
  description: "Creates a new Supabase project within a specified organization. [See the documentation](https://supabase.com/docs/reference/api/v1-create-a-project)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    supabaseManagementApi,
    organizationId: {
      propDefinition: [
        supabaseManagementApi,
        "organizationId",
      ],
    },
    projectName: {
      type: "string",
      label: "Project Name",
      description: "The name of the project",
    },
    dbPassword: {
      type: "string",
      label: "Database Password",
      description: "The password for the database",
    },
    region: {
      propDefinition: [
        supabaseManagementApi,
        "region",
      ],
    },
    instanceSize: {
      propDefinition: [
        supabaseManagementApi,
        "instanceSize",
      ],
    },
    templateUrl: {
      type: "string",
      label: "Template URL",
      description: "The template URL used to create the project from the CLI",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.supabaseManagementApi.createProject({
      $,
      data: {
        organization_id: this.organizationId,
        name: this.projectName,
        db_pass: this.dbPassword,
        region: this.region,
        desired_instance_size: this.instanceSize,
        template_url: this.templateUrl,
      },
    });
    $.export("$summary", `Successfully created project: ${this.projectName}`);
    return response;
  },
};
