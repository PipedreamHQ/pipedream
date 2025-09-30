import influxDbCloud from "../../influxdb_cloud.app.mjs";

export default {
  key: "influxdb_cloud-write-data",
  name: "Write Data",
  description: "Write data to a specific bucket in InfluxDB Cloud. [See the documentation](https://docs.influxdata.com/influxdb3/cloud-serverless/api/v2/#operation/PostWrite)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    data: {
      type: "string",
      label: "Data",
      description: "Provide data in [line protocol format](https://docs.influxdata.com/influxdb3/cloud-serverless/reference/syntax/line-protocol/). Example: `measurementName fieldKey=\"field string value\" 1795523542833000000`",
    },
    precision: {
      type: "string",
      label: "Precision",
      description: "The precision for unix timestamps in the line protocol batch",
      options: [
        "ms",
        "s",
        "us",
        "ns",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.influxDbCloud.writeData({
      $,
      params: {
        bucket: this.bucketId,
        precision: this.precision,
      },
      data: this.data,
      headers: {
        "Content-Type": "text/plain",
      },
    });
    $.export("$summary", "Successfully wrote data to bucket");
    return response;
  },
};
