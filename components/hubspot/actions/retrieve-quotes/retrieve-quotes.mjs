import { OBJECT_TYPE } from "../../common/constants.mjs";
import hubspot from "../../hubspot.app.mjs";

const DEFAULT_LIMIT = 100;

export default {
  key: "hubspot-retrieve-quotes",
  name: "Retrieve Quotes",
  description:
    "Fetch one quote by ID or list quotes with CRM v3 pagination (`after`, `limit`)."
    + " Complements **Create CRM Object** for quotes when you need read access outside **Search CRM**."
    + " [See the documentation](https://developers.hubspot.com/docs/api-reference/crm-quotes-v3/basic/get-crm-v3-objects-quotes)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hubspot,
    quoteId: {
      propDefinition: [
        hubspot,
        "objectId",
        () => ({
          objectType: OBJECT_TYPE.QUOTE,
        }),
      ],
      label: "Quote ID",
      description:
        "Optional. Pick a quote from the list, search by name/title, or enter a quote ID. Leave empty to list quotes (use **After** / **Limit** for pagination).",
      optional: true,
    },
    after: {
      type: "string",
      label: "After (pagination cursor)",
      description: "Paging cursor from a previous list response (`paging.next.after`). Ignored when **Quote ID** is set.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Max quotes per page when listing. Ignored when **Quote ID** is set.",
      optional: true,
      default: DEFAULT_LIMIT,
      min: 1,
      max: 100,
    },
    properties: {
      type: "string[]",
      label: "Properties",
      description:
        "Optional. Select quote properties to include in the response, or leave empty for HubSpot's default set. Options load from your account's quote property schema.",
      optional: true,
      async options({ page }) {
        if (page !== 0) {
          return [];
        }
        const { results: props } = await this.hubspot.getProperties({
          objectType: OBJECT_TYPE.QUOTE,
        });
        return (
          props
            ?.filter((p) => !p.hidden)
            .map((property) => ({
              label: property.label
                ? `${property.label} (${property.name})`
                : property.name,
              value: property.name,
            })) || []
        );
      },
    },
  },
  async run({ $ }) {
    const limit = this.quoteId
      ? undefined
      : (this.limit ?? DEFAULT_LIMIT);

    const response = await this.hubspot.listQuotes({
      $,
      quoteId: this.quoteId || undefined,
      after: this.after || undefined,
      limit,
      properties: this.properties?.length
        ? this.properties
        : undefined,
    });

    if (this.quoteId) {
      $.export("$summary", `Retrieved quote \`${this.quoteId}\``);
    } else {
      const n = response?.results?.length ?? 0;
      $.export(
        "$summary",
        `Retrieved ${n} quote${n === 1
          ? ""
          : "s"}${response?.paging?.next?.after
          ? " (more pages available — pass **After**)"
          : ""}`,
      );
    }

    return response;
  },
};
