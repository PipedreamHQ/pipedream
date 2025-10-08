import onesignalRestApi from "../../onesignal_rest_api.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "onesignal_rest_api-get-devices",
  name: "Get Devices",
  description: "Get all devices. [See docs here](https://documentation.onesignal.com/reference/view-devices)",
  version: "0.0.1652718587",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    onesignalRestApi,
    exportToCSV: {
      label: "Export To CSV",
      description: "Return the list of devices in CSV",
      type: "boolean",
      optional: false,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const additionalProps = {};

    if (this.exportToCSV) {
      additionalProps.extraFields = {
        label: "Extra Fields",
        description: "Additional fields that you wish to include",
        type: "string[]",
        options: constants.EXTRA_FIELDS,
      };
    }

    return additionalProps;
  },
  async run({ $ }) {
    let response;

    if (this.exportToCSV) {
      response = await this.onesignalRestApi.exportDevicesToCSV({
        data: {
          extra_fields: this.extraFields,
        },
        $,
      });
    } else {
      response = await this.onesignalRestApi.getDevices({
        $,
      });
    }

    $.export("$summary", "Successfully retrieved devices.");

    return response;
  },
};
