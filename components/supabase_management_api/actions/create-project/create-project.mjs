import supabaseManagementApi from "../../supabase_management_api.app.mjs";

export default {
  key: "supabase_management_api-create-project",
  name: "Create Project",
  description: "Creates a new Supabase project within a specified organization.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    supabaseManagementApi,
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization",
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
      type: "string",
      label: "Region",
      description: "The region for the Supabase project",
    },
    instanceSize: {
      type: "string",
      label: "Instance Size",
      description: "The desired instance size for the Supabase project",
      optional: true,
    },
    templateUrl: {
      type: "string",
      label: "Template URL",
      description: "The template URL used to create the project from the CLI",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.supabaseManagementApi.createProject(
      this.organizationId,
      this.projectName,
      this.dbPassword,
      this.region,
      this.instanceSize,
      this.templateUrl,
    );
    $.export("$summary", `Successfully created project: ${this.projectName}`);
    return response;
  },
};
