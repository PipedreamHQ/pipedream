import { ConfigurationError } from "@pipedream/platform";
import shopify from "../../shopify.app.mjs";
import {
  COLLECTION_CONDITION_TYPES, PRODUCT_STATUSES,
} from "../../common/constants.mjs";

export default {
  key: "shopify-create-smart-collection",
  name: "Create Smart Collection",
  description: "Creates a smart collection whose membership is defined by conditions (rules). [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/collectionCreate)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shopify,
    title: {
      type: "string",
      label: "Title",
      description: "Title of the smart collection",
    },
    matchType: {
      type: "string",
      label: "Match Type",
      description: "Whether a product must match `ALL` of the conditions or `ANY` (at least one) to be included in the collection",
      options: [
        "ALL",
        "ANY",
      ],
      default: "ALL",
    },
    conditions: {
      type: "string",
      label: "Conditions",
      description: "A JSON array of condition objects that define which products are automatically included. Shape by `type`: text/tag/status types (`productTag`, `productTitle`, `productType`, `productVendor`, `variantTitle`, `productStatus`) use `values` (array) + `relation`; price types (`variantPrice`, `variantCompareAtPrice`) use `value` (amount) + `relation`; `variantInventory` uses `value` (integer) + `relation`; `variantWeight` uses `value` (number) + `unit` + `relation`. Relations by type — `productTag`: `TAGGED_WITH`/`NOT_TAGGED_WITH`; text: `EQUALS`/`NOT_EQUALS`/`CONTAINS`/`DOES_NOT_CONTAIN`/`STARTS_WITH`/`ENDS_WITH`; amounts: `EQUALS`/`NOT_EQUALS`/`GREATER_THAN`/`LESS_THAN`. Example: `[{\"type\":\"productTag\",\"relation\":\"TAGGED_WITH\",\"values\":[\"sale\"]}]`",
    },
  },
  async run({ $ }) {
    let parsed;
    try {
      parsed = JSON.parse(this.conditions);
    } catch {
      throw new ConfigurationError("`Conditions` must be a valid JSON array.");
    }
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new ConfigurationError("`Conditions` must be a non-empty JSON array of condition objects.");
    }

    let currencyCode;
    const conditions = [];
    for (const c of parsed) {
      const meta = COLLECTION_CONDITION_TYPES[c.type];
      if (!meta) {
        throw new ConfigurationError(`Unsupported condition type \`${c.type}\`. Supported: ${Object.keys(COLLECTION_CONDITION_TYPES).join(", ")}`);
      }
      if (!meta.relations.includes(c.relation)) {
        throw new ConfigurationError(`Invalid relation \`${c.relation}\` for \`${c.type}\`. Valid: ${meta.relations.join(", ")}`);
      }
      const {
        type, relation,
      } = c;
      if (meta.value === "list" || meta.value === "status") {
        const values = [
          c.values,
        ].flat().filter(Boolean);
        if (!values.length) {
          throw new ConfigurationError(`Condition \`${type}\` requires a non-empty \`values\` array.`);
        }
        if (meta.value === "status") {
          const invalid = values.filter((v) => !PRODUCT_STATUSES.includes(v));
          if (invalid.length) {
            throw new ConfigurationError(`Invalid product status \`${invalid.join(", ")}\`. Valid: ${PRODUCT_STATUSES.join(", ")}`);
          }
        }
        conditions.push({
          [type]: {
            relation,
            values,
            matchType: "ANY",
          },
        });
      } else {
        if (c.value === undefined || c.value === null || c.value === "") {
          throw new ConfigurationError(`Condition \`${type}\` requires a \`value\`.`);
        }
        if (meta.value === "int") {
          conditions.push({
            [type]: {
              relation,
              value: parseInt(c.value, 10),
            },
          });
        } else if (meta.value === "money") {
          if (!currencyCode) {
            currencyCode = await this.shopify.getShopCurrencyCode();
          }
          conditions.push({
            [type]: {
              relation,
              value: {
                amount: `${c.value}`,
                currencyCode,
              },
            },
          });
        } else if (meta.value === "weight") {
          if (!c.unit) {
            throw new ConfigurationError(`Condition \`${type}\` requires a \`unit\` (e.g. KILOGRAMS).`);
          }
          conditions.push({
            [type]: {
              relation,
              value: {
                value: parseFloat(c.value),
                unit: c.unit,
              },
            },
          });
        }
      }
    }

    const response = await this.shopify.createCollectionWithSources({
      collection: {
        title: this.title,
        sources: [
          {
            source: {
              title: this.title,
              inclusion: {
                conditions,
                matchType: this.matchType,
              },
            },
          },
        ],
      },
    });
    if (response.collectionCreate.userErrors.length > 0) {
      throw new Error(response.collectionCreate.userErrors[0].message);
    }
    $.export("$summary", `Created new smart collection \`${this.title}\` with ID \`${response.collectionCreate.collection.id}\``);
    return response;
  },
};
