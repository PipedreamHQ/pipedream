import app from "../../shipengine.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "shipengine-search-labels",
  name: "Search Labels",
  description: "By default, all labels are returned, 25 at a time, starting with the most recently created ones. You can combine multiple filter options to narrow-down the results. [See the docs](https://shipengine.github.io/shipengine-openapi/#operation/list_labels).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    labelStatus: {
      type: "string",
      label: "Label Status",
      description: "The status of the label. E.g. `processing`",
      options: constants.LABEL_STATUSES,
    },
    carrierId: {
      propDefinition: [
        app,
        "carrierId",
      ],
    },
    serviceCode: {
      propDefinition: [
        app,
        "serviceCode",
        ({ carrierId }) => ({
          carrierId,
        }),
      ],
    },
    trackingNumber: {
      label: "Tracking Number",
      description: "The tracking number associated with a shipment. E.g. `9405511899223197428490`",
      propDefinition: [
        app,
        "labelId",
        () => ({
          mapper: ({ tracking_number: value }) => value,
        }),
      ],
    },
    shipmentId: {
      propDefinition: [
        app,
        "shipmentId",
      ],
    },
  },
  async run({ $: step }) {
    const {
      labelStatus,
      serviceCode,
      carrierId,
      trackingNumber,
      shipmentId,
    } = this;

    const stream = this.app.getResourcesStream({
      resourcesFn: this.app.listLabels,
      resourcesFnArgs: {
        step,
        params: {
          label_status: labelStatus,
          service_code: serviceCode,
          carrier_id: carrierId,
          tracking_number: trackingNumber,
          shipment_id: shipmentId,
          page_size: constants.DEFAULT_LIMIT,
        },
      },
      resourcesName: "labels",
    });

    const resources = await utils.streamIterator(stream);

    step.export("$summary", `Successfully retrieved ${utils.summaryEnd(resources.length, "label")}.`);

    return resources;
  },
};
