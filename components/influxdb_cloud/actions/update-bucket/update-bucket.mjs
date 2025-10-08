import influxDbCloud from "../../influxdb_cloud.app.mjs";

export default {
  key: "influxdb_cloud-update-bucket",
  name: "Update Bucket",
  description: "Updates an existing bucket in InfluxDB Cloud. [See the documentation](https://docs.influxdata.com/influxdb3/cloud-serverless/api/v2/#operation/PatchBucketsID)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    influxDbCloud,
    bucketId: {
      propDefinition: [
        influxDbCloud,
        "bucketId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the bucket. Must contain two or more characters. Cannot start with an underscore (_). Cannot contain a double quote (\"). Note: System buckets cannot be renamed.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the bucket",
      optional: true,
    },
    everySeconds: {
      type: "integer",
      label: "Every Seconds",
      description: "The duration in seconds for how long data will be kept in the database. The default duration is 2592000 (30 days). 0 represents infinite retention.",
      default: 2592000,
      optional: true,
    },
    shardGroupDurationSeconds: {
      type: "integer",
      label: "Shard Group Duration Seconds",
      description: "The shard group duration. The duration or interval (in seconds) that each shard group covers.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.influxDbCloud.updateBucket({
      $,
      bucketId: this.bucketId,
      data: {
        name: this.name,
        description: this.description,
        retentionRules: [
          {
            everySeconds: this.everySeconds,
            shardGroupDurationSeconds: this.shardGroupDurationSeconds,
            type: "expire",
          },
        ],
      },
    });
    $.export("$summary", `Successfully updated bucket with ID: ${response.id}`);
    return response;
  },
};
