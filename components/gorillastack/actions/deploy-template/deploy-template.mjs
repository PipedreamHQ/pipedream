import app from "../../gorillastack.app.mjs";

export default {
  key: "gorillastack-deploy-template",
  name: "Deploy Template",
  description: "Deploy a template definition. [See the documentation](https://docs.gorillastack.com/swagger/v2#/templates/get_teams__teamId__templates_deployments)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Deployment Name",
      description: "Name for this deployment.",
    },
    templateDefinitionId: {
      type: "string",
      label: "Template Definition Id",
      description: "Id of the template definition to deploy.",
      async options() {
        const { templateDeployments } = await this.app.getDeploymentTemplates({
          $: this,
          params: {
            "filter.status": "CREATED",
          },
        });
        return templateDeployments.map((template) => ({
          label: template.name,
          value: template._id,
        }));
      },
    },
    parameters: {
      type: "object",
      label: "Parameters",
      description: "Parameters for this deployment.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.deployTemplate({
      $,
      data: {
        name: this.name,
        parameters: this.parameters || {},
        templateDefinition: {
          uniqueId: this.templateDefinitionId,
        },
      },
    });
    $.export("$summary", `Successfully deployed template "${this.templateDefinitionId}"`);
    return response;
  },
};
