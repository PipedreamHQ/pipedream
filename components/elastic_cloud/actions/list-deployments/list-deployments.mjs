// x-pd-ai: optimized
import elasticCloud from "../../elastic_cloud.app.mjs";

export default {
  key: "elastic_cloud-list-deployments",
  name: "List Deployments",
  description: "List all deployments in your Elastic Cloud organization. Use this first to discover deployment IDs before calling **Get Deployment** or **Update Deployment**. [See the documentation](https://www.elastic.co/docs/api/doc/cloud/operation/operation-list-deployments)",
  version: "0.0.1",
  type: "action",
  props: {
    elasticCloud,
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const response = await this.elasticCloud.listDeployments({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.deployments?.length ?? 0} deployment(s)`);
    return response;
  },
};
