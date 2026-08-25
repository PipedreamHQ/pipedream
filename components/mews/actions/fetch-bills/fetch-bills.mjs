import { ConfigurationError } from "@pipedream/platform";
import app from "../../mews.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  name: "Fetch Bills",
  description: "Retrieve bills using Mews Connector API. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/bills#get-all-bills)",
  key: "mews-fetch-bills",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    enterpriseIds: {
      propDefinition: [
        app,
        "enterpriseIds",
      ],
    },
    billIds: {
      type: "string[]",
      label: "Bill IDs",
      description: "Unique identifiers (GUIDs) of the Bills. Required if no other filter is provided (max 1000 items).",
      optional: true,
      propDefinition: [
        app,
        "billId",
      ],
    },
    customerIds: {
      type: "string[]",
      label: "Customer IDs",
      description: "Unique identifiers (GUIDs) of the Customers the bills are issued to, as returned by **Fetch Customers** (max 1000 items).",
      optional: true,
      propDefinition: [
        app,
        "customerId",
      ],
    },
    issuedStartUtc: {
      type: "string",
      label: "Issued Start (UTC)",
      description: "Start of the interval in which the Bill was issued. ISO 8601 format. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    issuedEndUtc: {
      type: "string",
      label: "Issued End (UTC)",
      description: "End of the interval in which the Bill was issued. ISO 8601 format (max 3 months interval). Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    paidStartUtc: {
      type: "string",
      label: "Paid Start (UTC)",
      description: "Start of the interval in which the Bill was paid. ISO 8601 format. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    paidEndUtc: {
      type: "string",
      label: "Paid End (UTC)",
      description: "End of the interval in which the Bill was paid. ISO 8601 format (max 3 months interval). Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    dueStartUtc: {
      type: "string",
      label: "Due Start (UTC)",
      description: "Start of the interval in which the Bill is due to be paid. ISO 8601 format. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    dueEndUtc: {
      type: "string",
      label: "Due End (UTC)",
      description: "End of the interval in which the Bill is due to be paid. ISO 8601 format (max 3 months interval). Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    createdStartUtc: {
      description: "Start of the interval in which the Bill was created. ISO 8601 format. Eg. `2025-01-01T00:00:00Z`",
      propDefinition: [
        app,
        "createdStartUtc",
      ],
    },
    createdEndUtc: {
      description: "End of the interval in which the Bill was created. ISO 8601 format (max 3 months interval). Eg. `2025-01-01T00:00:00Z`",
      propDefinition: [
        app,
        "createdEndUtc",
      ],
    },
    updatedStartUtc: {
      description: "Start of the interval in which the Bill was updated. ISO 8601 format. Eg. `2025-01-01T00:00:00Z`",
      propDefinition: [
        app,
        "updatedStartUtc",
      ],
    },
    updatedEndUtc: {
      description: "End of the interval in which the Bill was updated. ISO 8601 format (max 3 months interval). Eg. `2025-01-01T00:00:00Z`",
      propDefinition: [
        app,
        "updatedEndUtc",
      ],
    },
    state: {
      type: "string",
      label: "State",
      description: "State the bills should be in. If not specified, both `Open` and `Closed` bills are returned.",
      optional: true,
      options: [
        "Open",
        "Closed",
      ],
    },
    billType: {
      type: "string",
      label: "Type",
      description: "Type of the bills. If not specified, all types are returned. `Receipt` is a bill paid in full, `Invoice` is a bill issued to request payment.",
      optional: true,
      options: [
        "Receipt",
        "Invoice",
      ],
    },
    correctionStates: {
      type: "string[]",
      label: "Correction States",
      description: "Whether to return regular bills, corrective bills, or both. If **Bill IDs** are specified, defaults to both, otherwise defaults to `Bill`.",
      optional: true,
      options: [
        "Bill",
        "CorrectiveBill",
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
      enterpriseIds,
      billIds,
      customerIds,
      issuedStartUtc,
      issuedEndUtc,
      paidStartUtc,
      paidEndUtc,
      dueStartUtc,
      dueEndUtc,
      createdStartUtc,
      createdEndUtc,
      updatedStartUtc,
      updatedEndUtc,
      state,
      billType,
      correctionStates,
      maxResults,
    } = this;

    const parsedEnterpriseIds = utils.parseArrayProp("Enterprise IDs", enterpriseIds);
    const parsedBillIds = utils.parseArrayProp("Bill IDs", billIds);
    const parsedCustomerIds = utils.parseArrayProp("Customer IDs", customerIds);
    const parsedCorrectionStates = utils.parseArrayProp("Correction States", correctionStates);

    const hasFilter = [
      parsedBillIds,
      parsedCustomerIds,
      issuedStartUtc,
      issuedEndUtc,
      paidStartUtc,
      paidEndUtc,
      dueStartUtc,
      dueEndUtc,
      createdStartUtc,
      createdEndUtc,
      updatedStartUtc,
      updatedEndUtc,
    ].some((value) => value?.length);

    if (!hasFilter) {
      throw new ConfigurationError("At least one filter is required. Provide **Bill IDs**, **Customer IDs**, or one of the date intervals.");
    }

    const items = await app.paginate({
      requester: app.billsGetAll,
      requesterArgs: {
        $,
        data: {
          ...(issuedStartUtc || issuedEndUtc) && {
            IssuedUtc: {
              StartUtc: issuedStartUtc,
              EndUtc: issuedEndUtc,
            },
          },
          ...(paidStartUtc || paidEndUtc) && {
            PaidUtc: {
              StartUtc: paidStartUtc,
              EndUtc: paidEndUtc,
            },
          },
          ...(dueStartUtc || dueEndUtc) && {
            DueUtc: {
              StartUtc: dueStartUtc,
              EndUtc: dueEndUtc,
            },
          },
          ...(createdStartUtc || createdEndUtc) && {
            CreatedUtc: {
              StartUtc: createdStartUtc,
              EndUtc: createdEndUtc,
            },
          },
          ...(updatedStartUtc || updatedEndUtc) && {
            UpdatedUtc: {
              StartUtc: updatedStartUtc,
              EndUtc: updatedEndUtc,
            },
          },
          EnterpriseIds: parsedEnterpriseIds,
          BillIds: parsedBillIds,
          CustomerIds: parsedCustomerIds,
          State: state,
          Type: billType,
          CorrectionState: parsedCorrectionStates,
        },
      },
      resultKey: "Bills",
      maxResults,
    });

    $.export("$summary", `Successfully fetched ${items.length} bill${items.length !== 1
      ? "s"
      : ""}`);
    return items;
  },
};
