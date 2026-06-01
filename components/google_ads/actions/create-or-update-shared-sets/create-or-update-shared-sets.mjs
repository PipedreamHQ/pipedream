import { ConfigurationError } from "@pipedream/platform";
import googleAds from "../../google_ads.app.mjs";
import {
  CAMPAIGN_OPERATION_TYPES,
  SHARED_SET_TYPES,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import { getAdditionalFields } from "../common/props.mjs";

const docLink =
  "https://developers.google.com/google-ads/api/reference/rpc/v21/SharedSetService/MutateSharedSets?transport=rest";

export default {
  key: "google_ads-create-or-update-shared-sets",
  name: "Create or Update Shared Sets",
  description: `Creates or updates shared sets (reusable lists of negative keywords or placements). [See the documentation](${docLink})`,
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    googleAds,
    accountId: {
      propDefinition: [
        googleAds,
        "accountId",
      ],
    },
    customerClientId: {
      propDefinition: [
        googleAds,
        "customerClientId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
      optional: true,
    },
    operationType: {
      type: "string",
      label: "Operation Type",
      description: "Whether to create, update, or remove a shared set.",
      options: CAMPAIGN_OPERATION_TYPES,
    },
    sharedSetId: {
      propDefinition: [
        googleAds,
        "sharedSetId",
        ({
          accountId, customerClientId,
        }) => ({
          accountId,
          customerClientId,
        }),
      ],
      description: "The shared set to update or remove. Required for **Update** and **Remove** operations.",
      optional: true,
    },
    updateMask: {
      type: "string",
      label: "Update Mask",
      description: "Comma-separated list of fields to update (e.g., `name`). Required for **Update** operations.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the shared set. Required for **Create** operations.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the shared set. Required for **Create** operations. Immutable after creation.",
      options: SHARED_SET_TYPES,
      optional: true,
    },
    additionalFields: getAdditionalFields(docLink),
  },
  async run({ $ }) {
    const {
      googleAds,
      accountId,
      customerClientId,
      operationType,
      sharedSetId,
      updateMask,
      name,
      type,
      additionalFields,
    } = this;

    if ((operationType === "update" || operationType === "remove") && !sharedSetId) {
      throw new ConfigurationError(
        "**Shared Set** is required for Update and Remove operations.",
      );
    }

    if (operationType === "update" && !updateMask) {
      throw new ConfigurationError(
        "**Update Mask** is required for Update operations.",
      );
    }

    if (operationType === "create") {
      if (!name) {
        throw new ConfigurationError(
          "**Name** is required for Create operations.",
        );
      }
      if (!type) {
        throw new ConfigurationError(
          "**Type** is required for Create operations.",
        );
      }
    }

    const customerId = customerClientId ?? accountId;
    const resourceName = sharedSetId
      ? `customers/${customerId}/sharedSets/${sharedSetId}`
      : undefined;

    let operation;

    if (operationType === "remove") {
      operation = {
        remove: resourceName,
      };
    } else {
      const sharedSetData = {
        ...(resourceName && {
          resourceName,
        }),
        ...(name && {
          name,
        }),
        ...(type && {
          type,
        }),
        ...parseObject(additionalFields),
      };

      if (operationType === "update") {
        operation = {
          update: sharedSetData,
          updateMask,
        };
      } else {
        operation = {
          create: sharedSetData,
        };
      }
    }

    const response = await googleAds.mutateSharedSets({
      $,
      accountId,
      customerClientId,
      data: {
        operations: [
          operation,
        ],
      },
    });

    const result = response?.results?.[0];
    const id = result?.resourceName?.split("/").pop();

    $.export(
      "$summary",
      `Successfully ${operationType}d shared set${id
        ? ` with ID \`${id}\``
        : ""}.`,
    );
    return response;
  },
};
