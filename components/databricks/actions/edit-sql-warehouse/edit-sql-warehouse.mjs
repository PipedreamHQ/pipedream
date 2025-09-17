import databricks from "../../databricks.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "databricks-edit-sql-warehouse",
  name: "Edit SQL Warehouse",
  description: "Edits the configuration of an existing SQL Warehouse. [See the documentation](https://docs.databricks.com/api/workspace/warehouses/edit)",
  version: "0.0.2",
  type: "action",
  props: {
    databricks,
    warehouseId: {
      description: "The ID of the SQL Warehouse to edit",
      propDefinition: [
        databricks,
        "warehouseId",
      ],
    },
    name: {
      type: "string",
      label: "Warehouse Name",
      description: "Logical name for the warehouse. Must be unique within an org and under 100 characters.",
      optional: true,
    },
    clusterSize: {
      type: "string",
      label: "Cluster Size",
      description: "Size of clusters allocated for this warehouse.",
      options: constants.CLUSTER_SIZES,
      optional: true,
    },
    autoStopMins: {
      type: "integer",
      label: "Auto Stop (minutes)",
      description: "Minutes of inactivity before auto-stop. 0 disables autostop. Must be 0 or ≥ 10.",
      optional: true,
    },
    minNumClusters: {
      type: "integer",
      label: "Min Number of Clusters",
      description: "Minimum number of available clusters (> 0 and ≤ min(max_num_clusters, 30)).",
      optional: true,
    },
    maxNumClusters: {
      type: "integer",
      label: "Max Number of Clusters",
      description: "Maximum number of clusters for autoscaler (≥ min_num_clusters and ≤ 30).",
      optional: true,
    },
    enablePhoton: {
      type: "boolean",
      label: "Enable Photon",
      description: "Use Photon optimized clusters.",
      optional: true,
    },
    enableServerlessCompute: {
      type: "boolean",
      label: "Enable Serverless Compute",
      description: "Use serverless compute for this warehouse.",
      optional: true,
    },
    warehouseType: {
      type: "string",
      label: "Warehouse Type",
      description: "Set to PRO (recommended) or CLASSIC. Set PRO + enable serverless to use serverless.",
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
      description: "Whether the warehouse should use spot instances.",
      options: [
        "POLICY_UNSPECIFIED",
        "COST_OPTIMIZED",
        "RELIABILITY_OPTIMIZED",
      ],
      optional: true,
    },
    tags: {
      type: "object",
      label: "Tags",
      description: "Key-value tags for all resources associated with this warehouse (fewer than 45 tags).",
      optional: true,
    },
    channel: {
      type: "object",
      label: "Channel",
      description: "Channel details. Example: `{ \"name\": \"CHANNEL_NAME_CUSTOM\", \"dbsql_version\": \"2023.35\" }`",
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
    const payload = {};

    if (this.name !== undefined) {
      if (typeof this.name !== "string" || this.name.length >= 100) {
        throw new ConfigurationError("name must be a string with fewer than 100 characters.");
      }
      payload.name = this.name;
    }
    if (this.clusterSize !== undefined) payload.cluster_size = this.clusterSize;

    if (this.autoStopMins !== undefined) {
      if (this.autoStopMins !== 0 && this.autoStopMins < 10) {
        throw new ConfigurationError("autoStopMins must be 0 or >= 10.");
      }
      payload.auto_stop_mins = this.autoStopMins;
    }

    if (this.minNumClusters !== undefined) {
      if (this.minNumClusters < 1 || this.minNumClusters > 30) {
        throw new ConfigurationError("minNumClusters must be between 1 and 30.");
      }
      payload.min_num_clusters = this.minNumClusters;
    }

    if (this.maxNumClusters !== undefined) {
      if (this.maxNumClusters < 1 || this.maxNumClusters > 30) {
        throw new ConfigurationError("maxNumClusters must be between 1 and 30.");
      }
      if (this.minNumClusters !== undefined && this.maxNumClusters < this.minNumClusters) {
        throw new ConfigurationError("maxNumClusters must be >= minNumClusters.");
      }
      payload.max_num_clusters = this.maxNumClusters;
    }

    if (this.enablePhoton !== undefined) payload.enable_photon = this.enablePhoton;
    if (this.enableServerlessCompute !== undefined) {
      if (this.warehouseType === "CLASSIC" && this.enableServerlessCompute) {
        throw new ConfigurationError("Serverless compute requires warehouseType = PRO.");
      }
      payload.enable_serverless_compute = this.enableServerlessCompute;
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
    if (this.warehouseType !== undefined) payload.warehouse_type = this.warehouseType;
    if (this.spotInstancePolicy !== undefined) {
      payload.spot_instance_policy = this.spotInstancePolicy;
    }
    if (this.channel !== undefined) payload.channel = utils.parseObject(this.channel);
    if (this.instanceProfileArn !== undefined) {
      payload.instance_profile_arn = this.instanceProfileArn;
    }

    if (!Object.keys(payload).length) {
      throw new ConfigurationError("No fields to update. Provide at least one property.");
    }

    const response = await this.databricks.editSQLWarehouse({
      warehouseId: this.warehouseId,
      data: payload,
      $,
    });

    $.export("$summary", `Successfully edited SQL Warehouse ID ${this.warehouseId}`);
    return response;
  },
};
