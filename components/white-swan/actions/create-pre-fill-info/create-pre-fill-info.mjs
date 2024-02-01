import { axios } from "@pipedream/platform";
import whiteSwan from "../../white_swan.app.mjs";

export default {
  key: "white-swan-create-pre-fill-info",
  name: "Create Pre-fill Info",
  description: "Imports client data for pre-filling applications to enrich the user experience.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    whiteSwan,
    clientData: {
      propDefinition: [
        whiteSwan,
        "clientData",
      ],
    },
    dataType: {
      propDefinition: [
        whiteSwan,
        "dataType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.whiteSwan.importClientData({
      data: this.clientData,
      dataType: this.dataType,
    });
    $.export("$summary", "Successfully imported client data for pre-filling applications");
    return response;
  },
};
