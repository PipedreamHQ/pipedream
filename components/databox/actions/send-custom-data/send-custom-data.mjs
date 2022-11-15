import databox from "../../databox.app.mjs";

export default {
  name: "Send Custom Data",
  version: "0.0.1",
  key: "databox-send-custom-adta",
  description: "Sends custom data. [See docs here](https://developers.databox.com/send-data/)",
  type: "action",
  props: {
    databox,
    metricKey: {
      propDefinition: [
        databox,
        "metricKey",
      ],
    },
    value: {
      label: "Value",
      description: "The value to insert on metric",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.databox.sendCustomData({
      key: this.metricKey,
      value: this.value,
    });

    if (response.status !== "OK") {
      throw new Error(response.message);
    }

    $.export("$summary", `Successfully pushed data with id ${response.id}`);

    return response;
  },
};
