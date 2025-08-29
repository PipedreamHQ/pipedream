import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-edit-sql-warehouse",
  name: "Edit SQL Warehouse",
  description: "Edits the configuration of an existing SQL Warehouse. [See docs](https://docs.databricks.com/api/workspace/warehouses/edit)",
  version: "0.0.1",
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
      options: [
        "2X-Small",
        "X-Small",
        "Small",
        "Medium",
        "Large",
        "X-Large",
        "2X-Large",
        "3X-Large",
        "4X-Large",
      ],
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
      description: "Channel details. Example: `{ \"name\": \"CHANNEL_NAME_CURRENT\", \"dbsql_version\": \"2023.35\" }`",
      optional: true,
    },
    creatorName: {
      type: "string",
      label: "Creator Name",
      description: "Warehouse creator name.",
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

    if (this.name) payload.name = this.name;
    if (this.clusterSize) payload.cluster_size = this.clusterSize;

    if (this.autoStopMins !== undefined) payload.auto_stop_mins = this.autoStopMins;
    if (this.minNumClusters !== undefined) payload.min_num_clusters = this.minNumClusters;
    if (this.maxNumClusters !== undefined) payload.max_num_clusters = this.maxNumClusters;

    if (this.enablePhoton !== undefined) payload.enable_photon = this.enablePhoton;
    if (this.enableServerlessCompute !== undefined) {
      payload.enable_serverless_compute = this.enableServerlessCompute;
    }

    if (this.warehouseType) payload.warehouse_type = this.warehouseType;
    if (this.spotInstancePolicy) payload.spot_instance_policy = this.spotInstancePolicy;

    if (this.tags) payload.tags = this.tags;
    if (this.channel) payload.channel = this.channel;
    if (this.creatorName) payload.creator_name = this.creatorName;
    if (this.instanceProfileArn) payload.instance_profile_arn = this.instanceProfileArn;

    if (!Object.keys(payload).length) {
      throw new Error("No fields to update. Provide at least one property.");
    }
    if (this.autoStopMins !== undefined && this.autoStopMins !== 0 && this.autoStopMins < 10) {
      throw new Error("autoStopMins must be 0 or >= 10.");
    }
    if (
      this.minNumClusters !== undefined &&
      (this.minNumClusters < 1 || this.minNumClusters > 30)
    ) {
      throw new Error("minNumClusters must be between 1 and 30.");
    }
    if (
      this.maxNumClusters !== undefined &&
      (this.maxNumClusters < 1 || this.maxNumClusters > 30)
    ) {
      throw new Error("maxNumClusters must be between 1 and 30.");
    }
    if (this.minNumClusters !== undefined &&
      this.maxNumClusters !== undefined &&
      this.minNumClusters > this.maxNumClusters) {
      throw new Error("minNumClusters must be <= maxNumClusters.");
    }
    if (this.enableServerlessCompute === true && this.warehouseType === "CLASSIC") {
      throw new Error("Serverless compute requires warehouseType = PRO.");
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
