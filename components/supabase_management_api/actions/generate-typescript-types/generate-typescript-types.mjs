import supabaseManagementApi from "../../supabase_management_api.app.mjs";

export default {
  key: "supabase_management_api-generate-typescript-types",
  name: "Generate TypeScript Types",
  description: "Generates TypeScript types based on the current database schema for a specified Supabase project.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    supabaseManagementApi,
    projectRef: {
      propDefinition: [
        supabaseManagementApi,
        "projectRef",
      ],
    },
    includedSchemas: {
      propDefinition: [
        supabaseManagementApi,
        "includedSchemas",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.supabaseManagementApi.generateTypescriptTypes(this.projectRef, this.includedSchemas);
    $.export("$summary", `Successfully generated TypeScript types for project ${this.projectRef}`);
    return response;
  },
};
