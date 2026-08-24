// x-pd-ai: optimized
import elasticCloud from "../../elastic_cloud.app.mjs";

export default {
  key: "elastic_cloud-get-deployment",
  name: "Get Deployment",
  description: "Retrieve a single Elastic Cloud deployment by ID. Run **List Deployments** first to find a valid deployment ID. [See the documentation](https://www.elastic.co/docs/api/doc/cloud/operation/operation-get-deployment)",
  version: "0.0.1",
  type: "action",
  props: {
    elasticCloud,
    deploymentId: {
      propDefinition: [
        elasticCloud,
        "deploymentId",
      ],
    },
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const response = await this.elasticCloud.getDeployment({
      $,
      deploymentId: this.deploymentId,
    });
    $.export("$summary", `Successfully retrieved deployment ${this.deploymentId}`);
    return response;
  },
};
