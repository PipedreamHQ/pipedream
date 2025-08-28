import {
  DEFAULT_LIMIT, DEFAULT_PRODUCT_PROPERTIES,
} from "../../common/constants.mjs";
import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-or-updated-product",
  name: "New or Updated Product",
  description: "Emit new event for each new or updated product in Hubspot.",
  version: "0.0.13",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    info: {
      type: "alert",
      alertType: "info",
      content: `Properties:\n\`${DEFAULT_PRODUCT_PROPERTIES.join(", ")}\``,
    },
    properties: {
      propDefinition: [
        common.props.hubspot,
        "productProperties",
        () => ({
          excludeDefaultProperties: true,
        }),
      ],
      label: "Additional properties to retrieve",
    },
    newOnly: {
      type: "boolean",
      label: "New Only",
      description: "Emit events only for new products",
      default: false,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getTs(product) {
      return this.newOnly
        ? Date.parse(product.createdAt)
        : Date.parse(product.updatedAt);
    },
    generateMeta(product) {
      const {
        id,
        properties,
      } = product;
      const ts = this.getTs(product);
      return {
        id: this.newOnly
          ? id
          : `${id}-${ts}`,
        summary: properties.name,
        ts,
      };
    },
    isRelevant(product, updatedAfter) {
      return this.getTs(product) > updatedAfter;
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
            ...DEFAULT_PRODUCT_PROPERTIES,
            ...properties,
          ],
        },
        object: "products",
      };
    },
    async processResults(after, params) {
      await this.searchCRM(params, after);
    },
  },
  sampleEmit,
};
