import elasticCloud from "../../elastic_cloud.app.mjs";

export default {
  key: "elastic_cloud-create-deployment",
  name: "Create Deployment",
  description: "Create a new Elastic Cloud deployment. Requires a name, region, and version at minimum. Provide the `resources` JSON object to configure Elasticsearch/Kibana/APM topology; omit it to accept region defaults. [See the documentation](https://www.elastic.co/docs/api/doc/cloud/operation/operation-create-deployment)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  props: {
    elasticCloud,
    name: {
      propDefinition: [
        elasticCloud,
        "name",
      ],
      description: "A human-readable name for the new deployment (e.g. `agent-test-cluster`).",
    },
    region: {
      propDefinition: [
        elasticCloud,
        "region",
      ],
    },
    version: {
      propDefinition: [
        elasticCloud,
        "version",
      ],
    },
    resources: {
      propDefinition: [
        elasticCloud,
        "resources",
      ],
      optional: true,
    },
    alias: {
      type: "string",
      label: "Alias",
      description: "Optional custom alias (subdomain) for the deployment endpoint.",
      optional: true,
    },
    metadata: {
      propDefinition: [
        elasticCloud,
        "metadata",
      ],
      optional: true,
    },
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const resources = this.resources
      ? JSON.parse(this.resources)
      : undefined;
    const metadata = this.metadata
      ? JSON.parse(this.metadata)
      : undefined;
    const response = await this.elasticCloud.createDeployment({
      $,
      data: {
        name: this.name,
        region: this.region,
        version: this.version,
        resources,
        alias: this.alias,
        metadata,
      },
    });
    $.export("$summary", `Successfully created deployment ${response.id}: ${this.name}`);
    return response;
  },
};
