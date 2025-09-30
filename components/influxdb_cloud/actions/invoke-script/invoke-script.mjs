import influxDbCloud from "../../influxdb_cloud.app.mjs";
import { parseObjectEntries } from "../../common/utils.mjs";

export default {
  key: "influxdb_cloud-invoke-script",
  name: "Invoke Script",
  description: "Runs a script and returns the result. [See the documentation](https://docs.influxdata.com/influxdb3/cloud-serverless/api/v2/#operation/PostScriptsIDInvoke)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    influxDbCloud,
    scriptId: {
      propDefinition: [
        influxDbCloud,
        "scriptId",
      ],
    },
    params: {
      type: "object",
      label: "Params",
      description: "The script parameters. params contains key-value pairs that map values to the params.keys in a script. When you invoke a script with params, InfluxDB passes the values as invocation parameters to the script.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.influxDbCloud.invokeScript({
      $,
      scriptId: this.scriptId,
      data: {
        params: this.params
          ? parseObjectEntries(this.params)
          : {},
      },
    });
    $.export("$summary", `Successfully invoked script with ID: ${this.scriptId}`);
    return response;
  },
};
