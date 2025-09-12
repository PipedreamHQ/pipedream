import databricks from "../../databricks.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "databricks-create-sql-warehouse",
  name: "Create SQL Warehouse",
  description: "Creates a new SQL Warehouse in Databricks. [See the documentation](https://docs.databricks.com/api/workspace/warehouses/create)",
  version: "0.0.3",
  type: "action",
  props: {
    databricks,
    name: {
      type: "string",
      label: "Warehouse Name",
      description: "A human-readable name for the warehouse",
    },
    clusterSize: {
      type: "string",
      label: "Cluster Size",
      description: "Size of the cluster",
      options: constants.CLUSTER_SIZES,
    },
    autoStopMinutes: {
      type: "integer",
      label: "Auto Stop (minutes)",
      description:
        "Minutes of inactivity before auto-stop. 0 disables auto-stop. Must be 0 or ≥ 10.",
      optional: true,
      default: 10,
    },
    minNumClusters: {
      type: "integer",
      label: "Min Number of Clusters",
      description: "Minimum number of clusters to maintain (> 0 and ≤ min(max_num_clusters, 30)).",
      optional: true,
      default: 1,
    },
    maxNumClusters: {
      type: "integer",
      label: "Max Number of Clusters",
      description: "Maximum number of clusters for autoscaler (≥ min_num_clusters and ≤ 30).",
      optional: true,
      default: 1,
    },
    enablePhoton: {
      type: "boolean",
      label: "Enable Photon",
      description: "Whether the warehouse should use Photon optimized clusters.",
      optional: true,
    },
    enableServerlessCompute: {
      type: "boolean",
      label: "Enable Serverless Compute",
      description: "Whether the warehouse should use serverless compute.",
      optional: true,
    },
    warehouseType: {
      type: "string",
      label: "Warehouse Type",
      description:
        "Warehouse type: PRO or CLASSIC. Set PRO + enableServerlessCompute = true to use serverless.",
      options: [
        "TYPE_UNSPECIFIED",
        "CLASSIC",
        "PRO",
      ],
      optional: true,
    },
    spotInstancePolicy: {
      type: "string",
      label: "Spot Instance Policy",
      description: "Configures whether the warehouse should use spot instances.",
      options: [
        "POLICY_UNSPECIFIED",
        "COST_OPTIMIZED",
        "RELIABILITY_OPTIMIZED",
      ],
      optional: true,
    },
    channel: {
      type: "object",
      label: "Channel",
      description:
        "Channel details. Example: `{ \"name\": \"CHANNEL_NAME_CUSTOM\", \"dbsql_version\": \"2023.35\" }`",
      optional: true,
    },
    tags: {
      type: "object",
      label: "Tags",
      description:
        "Custom key-value tags for resources associated with this SQL Warehouse.",
      optional: true,
    },
    instanceProfileArn: {
      type: "string",
      label: "Instance Profile ARN (Deprecated)",
      description: "Deprecated. Instance profile used to pass IAM role to the cluster.",
      optional: true,
    },
  },

  async run({ $ }) {
    const payload = {
      name: this.name,
      cluster_size: this.clusterSize,
    };

    if (this.autoStopMinutes !== undefined) {
      if (this.autoStopMinutes !== 0 && this.autoStopMinutes < 10) {
        throw new ConfigurationError("autoStopMinutes must be 0 or ≥ 10.");
      }
      payload.auto_stop_mins = this.autoStopMinutes;
    }

    const minNumClusters = this.minNumClusters ?? 1;
    if (minNumClusters < 1 || minNumClusters > 30) {
      throw new ConfigurationError("minNumClusters must be between 1 and 30.");
    }
    payload.min_num_clusters = minNumClusters;

    if (this.maxNumClusters !== undefined) {
      if (
        this.maxNumClusters < payload.min_num_clusters ||
        this.maxNumClusters > 30
      ) {
        throw new ConfigurationError(
          `maxNumClusters must be ≥ minNumClusters (${payload.min_num_clusters}) and ≤ 30.`,
        );
      }
      payload.max_num_clusters = this.maxNumClusters;
    }

    const parsedTags = utils.parseObject(this.tags);
    const tagArray = Object.entries(parsedTags).map(([
      key,
      value,
    ]) => ({
      key,
      value,
    }));
    if (tagArray.length) {
      payload.tags = {
        custom_tags: tagArray,
      };
    }

    if (this.enablePhoton !== undefined)
      payload.enable_photon = this.enablePhoton;
    if (this.enableServerlessCompute !== undefined)
      payload.enable_serverless_compute = this.enableServerlessCompute;
    if (this.warehouseType) payload.warehouse_type = this.warehouseType;
    if (this.spotInstancePolicy)
      payload.spot_instance_policy = this.spotInstancePolicy;
    if (this.channel) payload.channel = utils.parseObject(this.channel);
    if (this.instanceProfileArn)
      payload.instance_profile_arn = this.instanceProfileArn;

    const response = await this.databricks.createSQLWarehouse({
      data: payload,
      $,
    });

    $.export(
      "$summary",
      `Successfully created SQL Warehouse: ${response?.name || this.name}`,
    );
    return response;
  },
};
