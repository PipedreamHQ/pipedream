import app from "../../mews.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  name: "Fetch Rates",
  description: "Retrieve rates (pricing setups) of the specified services using Mews Connector API. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/rates#get-all-rates)",
  key: "mews-fetch-rates",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    serviceIds: {
      type: "string[]",
      label: "Service IDs",
      description: "Unique identifiers (GUIDs) of the Services from which the rates are requested, as returned by [Get all services](https://mews-systems.gitbook.io/connector-api/operations/services#get-all-services) (max 1000 items).",
      propDefinition: [
        app,
        "serviceId",
      ],
    },
    enterpriseIds: {
      propDefinition: [
        app,
        "enterpriseIds",
      ],
    },
    rateIds: {
      type: "string[]",
      label: "Rate IDs",
      description: "Unique identifiers (GUIDs) of the requested Rates (max 1000 items).",
      optional: true,
      propDefinition: [
        app,
        "rateId",
      ],
    },
    externalIdentifiers: {
      type: "string[]",
      label: "External Identifiers",
      description: "Identifiers of the Rates from external systems (max 1000 items).",
      optional: true,
    },
    updatedStartUtc: {
      description: "Start of the interval in which the Rate was updated. ISO 8601 format. Eg. `2025-01-01T00:00:00Z`",
      propDefinition: [
        app,
        "updatedStartUtc",
      ],
    },
    updatedEndUtc: {
      description: "End of the interval in which the Rate was updated. ISO 8601 format (max 3 months interval). Eg. `2025-01-01T00:00:00Z`",
      propDefinition: [
        app,
        "updatedEndUtc",
      ],
    },
    activityStates: {
      description: "Whether to return only active, only deleted, or both types of Rate. If not specified, both are returned.",
      propDefinition: [
        app,
        "activityStates",
      ],
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      serviceIds,
      enterpriseIds,
      rateIds,
      externalIdentifiers,
      updatedStartUtc,
      updatedEndUtc,
      activityStates,
      maxResults,
    } = this;

    const parsedServiceIds = utils.parseArrayProp("Service IDs", serviceIds);
    const parsedEnterpriseIds = utils.parseArrayProp("Enterprise IDs", enterpriseIds);
    const parsedRateIds = utils.parseArrayProp("Rate IDs", rateIds);
    const parsedExternalIdentifiers = utils.parseArrayProp("External Identifiers", externalIdentifiers);
    const parsedActivityStates = utils.parseArrayProp("Activity States", activityStates);

    const items = await app.paginate({
      requester: app.ratesGetAll,
      requesterArgs: {
        $,
        data: {
          ...(updatedStartUtc || updatedEndUtc) && {
            UpdatedUtc: {
              StartUtc: updatedStartUtc,
              EndUtc: updatedEndUtc,
            },
          },
          ServiceIds: parsedServiceIds,
          EnterpriseIds: parsedEnterpriseIds,
          RateIds: parsedRateIds,
          ExternalIdentifiers: parsedExternalIdentifiers,
          ActivityStates: parsedActivityStates,
          Extent: {
            Rates: true,
            AvailabilityBlockAssignments: false,
          },
        },
      },
      resultKey: "Rates",
      maxResults,
    });

    $.export("$summary", `Successfully fetched ${items.length} rate${items.length !== 1
      ? "s"
      : ""}`);
    return items;
  },
};
