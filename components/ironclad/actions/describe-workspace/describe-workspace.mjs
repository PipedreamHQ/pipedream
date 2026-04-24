import app from "../../ironclad.app.mjs";

export default {
  key: "ironclad-describe-workspace",
  name: "Describe Workspace",
  description: "Returns the orienting context for the connected Ironclad workspace: the configured record types with their property definitions, and the launchable workflow templates."
    + " **Use this first** as the identity / 'where am I' call — Ironclad has no /me endpoint, so the workspace metadata is the primary context."
    + " Returns record types keyed by their API key (use these keys in **Create Record** / **Update Record** `type` and in the `properties` object),"
    + " and workflow templates (use their `id` in **Describe Workflow Template** and **Launch Workflow**)."
    + " [See the documentation](https://developer.ironcladapp.com/reference/list-workflow-schemas)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const [
      metadata,
      templates,
    ] = await Promise.all([
      this.app.getRecordsSchema({
        $,
      }),
      this.app.listWorkflowSchemas({
        $,
      }),
    ]);

    const workflowTemplates = (templates?.list ?? templates?.workflowSchemas ?? []).map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
    }));

    const recordTypes = metadata?.recordTypes ?? {};
    const properties = metadata?.properties ?? {};

    $.export("$summary", `Workspace has ${Object.keys(recordTypes).length} record type(s) and ${workflowTemplates.length} workflow template(s)`);

    return {
      recordTypes,
      recordProperties: properties,
      workflowTemplates,
    };
  },
};
