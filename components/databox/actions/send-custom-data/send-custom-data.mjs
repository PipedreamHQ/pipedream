import databox from "../../databox.app.mjs";

export default {
  name: "Send Custom Data",
  version: "0.0.1",
  key: "databox-send-custom-adta",
  description: "Sends custom data. [See docs here](https://developers.databox.com/send-data/)",
  type: "action",
  props: {
    databox,
    propDefinition: [
      databox,
      "metricKey"
    ],
    description: {
      label: "Description",
      description: "The description of the company",
      type: "string",
      optional: true,
    },
    industry: {
      label: "Industry",
      description: "The industry of the company. E.g. `Brand Agency`",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.databox.createCompany({
      $,
      data: {
        name: this.name,
        description: this.description,
        industry: this.industry,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created company with id ${response.id}`);
    }

    return response;
  },
};
