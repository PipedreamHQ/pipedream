import app from "../../dpd_connect.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  name: "Get Parcel Status",
  description: "Get the status of a parcel by tracking number. [See the documentation](https://api.dpdconnect.nl/swagger/index.html#/default/status)",
  key: "dpd_connect-get-parcel-status",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    parcelNumber: {
      type: "string",
      label: "Parcel Number",
      description: "The 14-digit tracking number of the parcel. Example: `91001234567890`",
    },
  },
  async run({ $ }) {
    if (!/^\d{14}$/.test(this.parcelNumber)) {
      throw new ConfigurationError("Parcel number must be 14 digits long");
    }

    const response = await this.app.getParcelStatus({
      $,
      parcelNumber: this.parcelNumber,
    });

    const status = response?.shipmentInfo?.status;
    if (status) {
      $.export("$summary", `Successfully retrieved parcel status for ${this.parcelNumber}`);
    }
    return response;
  },
};
