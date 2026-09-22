import { ConfigurationError } from "@pipedream/platform";
import elasticCloud from "../../elastic_cloud.app.mjs";

export default {
  key: "elastic_cloud-update-deployment",
  name: "Update Deployment",
  description: "Update an existing Elastic Cloud deployment, including resizing cluster capacity. Cluster resize is performed here by supplying updated `resources` sizing (no separate resize action exists). Run **List Deployments** first to find the deployment ID. [See the documentation](https://www.elastic.co/docs/api/doc/cloud/operation/operation-update-deployment)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  props: {
    elasticCloud,
    deploymentId: {
      propDefinition: [
        elasticCloud,
        "deploymentId",
      ],
    },
    resources: {
      propDefinition: [
        elasticCloud,
        "resources",
      ],
      description: "JSON object describing the updated resource topology; used for general updates and for cluster resizing. Example (resize to 4096 MB memory across 2 zones): `{\"elasticsearch\":[{\"region\":\"gcp-us-central1\",\"plan\":{\"cluster_topology\":[{\"size\":{\"value\":4096,\"resource\":\"memory\"},\"zone_count\":2}]}}]}`. Note: region and version live inside each resource sub-object, not at the top level of the update body.",
      optional: true,
    },
    name: {
      propDefinition: [
        elasticCloud,
        "name",
      ],
      description: "Optional new human-readable name for the deployment.",
      optional: true,
    },
    pruneOrphans: {
      type: "boolean",
      label: "Prune Orphans",
      description: "Whether to shut down deployment resources that are not referenced in this update request. Resources are tracked by their `ref_id`. Set to `true` only when the `resources` you supply are the complete, authoritative definition of the deployment — anything omitted (e.g. an existing Kibana or APM resource) is shut down, though it can be restored from its latest snapshot afterwards. Defaults to `false`, which leaves omitted resources intact and is the safe choice for partial updates.",
      default: false,
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
    if (!this.name && !this.resources && !this.metadata) {
      throw new ConfigurationError("Set at least one field to update: Name, Resources, or Metadata.");
    }
    const resources = this.resources
      ? JSON.parse(this.resources)
      : undefined;
    const metadata = this.metadata
      ? JSON.parse(this.metadata)
      : undefined;
    const response = await this.elasticCloud.updateDeployment({
      $,
      deploymentId: this.deploymentId,
      data: {
        name: this.name,
        resources,
        // The API requires prune_orphans on every update request
        prune_orphans: this.pruneOrphans ?? false,
        metadata,
      },
    });
    $.export("$summary", `Successfully updated deployment ${this.deploymentId}`);
    return response;
  },
};
