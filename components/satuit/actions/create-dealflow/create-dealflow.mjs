import satuit from "../../satuit.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "satuit-create-dealflow",
  name: "Create Dealflow",
  description: "Creates a new dealflow within the Satuit platform, setting up a new series of business interactions. [See the documentation](https://satuittechnologies.zendesk.com/hc/en-us)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    satuit,
    dealName: {
      propDefinition: [
        satuit,
        "dealName",
      ],
    },
    involvedParties: {
      propDefinition: [
        satuit,
        "involvedParties",
      ],
    },
    dealValue: {
      propDefinition: [
        satuit,
        "dealValue",
        (c) => ({
          optional: true,
        }),
      ],
    },
    expectedClosingDate: {
      propDefinition: [
        satuit,
        "expectedClosingDate",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const data = {
      Deal_Name: this.dealName,
      Involved_Parties: this.involvedParties,
      ...(this.dealValue && {
        Deal_Value: this.dealValue,
      }),
      ...(this.expectedClosingDate && {
        Expected_Closing_Date: this.expectedClosingDate,
      }),
    };

    const response = await this.satuit.createDealFlow({
      data,
    });

    $.export("$summary", `Successfully created dealflow with name: ${this.dealName}`);
    return response;
  },
};
