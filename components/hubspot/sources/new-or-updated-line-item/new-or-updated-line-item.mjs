import {
  DEFAULT_LIMIT,
  DEFAULT_LINE_ITEM_PROPERTIES,
} from "../../common/constants.mjs";
import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-or-updated-line-item",
  name: "New or Updated Line Item",
  description: "Emit new event for each new line item added or updated in Hubspot.",
  version: "0.0.23",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    info: {
      type: "alert",
      alertType: "info",
      content: `Properties:\n\`${DEFAULT_LINE_ITEM_PROPERTIES.join(", ")}\``,
    },
    properties: {
      propDefinition: [
        common.props.hubspot,
        "lineItemProperties",
        () => ({
          excludeDefaultProperties: true,
        }),
      ],
      label: "Additional properties to retrieve",
    },
    newOnly: {
      type: "boolean",
      label: "New Only",
      description: "Emit events only for new line items",
      default: false,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getTs(lineItem) {
      return this.newOnly
        ? Date.parse(lineItem.createdAt)
        : Date.parse(lineItem.updatedAt);
    },
    generateMeta(lineItem) {
      const { id } = lineItem;
      const ts = this.getTs(lineItem);
      return {
        id: this.newOnly
          ? id
          : `${id}-${ts}`,
        summary: `Line Item ID: ${id}`,
        ts,
      };
    },
    isRelevant(lineItem, updatedAfter) {
      return this.getTs(lineItem) > updatedAfter;
    },
    getParams() {
      const { properties = [] } = this;
      return {
        data: {
          limit: DEFAULT_LIMIT,
          sorts: [
            {
              propertyName: "hs_lastmodifieddate",
              direction: "DESCENDING",
            },
          ],
          properties: [
            ...DEFAULT_LINE_ITEM_PROPERTIES,
            ...properties,
          ],
        },
        object: "line_items",
      };
    },
    async processResults(after, params) {
      await this.searchCRM(params, after);
    },
  },
  sampleEmit,
};
