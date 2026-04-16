import shopify from "../../shopify.app.mjs";
import {
  COLLECTION_RULE_COLUMNS, COLLECTION_RULE_RELATIONS,
} from "../../common/constants.mjs";

export default {
  key: "shopify-create-smart-collection",
  name: "Create Smart Collection",
  description: "Creates a smart collection. You can fill in any number of rules by selecting more than one option in each prop.[See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/collectionCreate)",
  version: "0.0.16",
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
    disjunctive: {
      type: "boolean",
      label: "Disjunctive",
      description: "If `false`, the product must match all the rules to be included in the smart collection. Otherwise, it only needs to match at least one rule",
      optional: true,
      default: false,
    },
    rules: {
      type: "integer",
      label: "Number of rules",
      description: "The number of rules to input",
      default: 1,
      min: 1,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    for (let i = 1; i <= this.rules; i++) {
      props[`column_${i}`] = {
        type: "string",
        label: `Rule ${i} - Column`,
        description: "The property of a product being used to populate the smart collection",
        options: COLLECTION_RULE_COLUMNS,
      };
      props[`relation_${i}`] = {
        type: "string",
        label: `Rule ${i} - Relation`,
        description: "The relationship between the **column** choice, and the **condition**",
        options: COLLECTION_RULE_RELATIONS,
      };
      props[`condition_${i}`] = {
        type: "string",
        label: `Rule ${i} - Condition`,
        description: "Select products for a smart collection using a **condition**. Values is either `string` or `number`, depending on the **relation** value",
      };
    }
    return props;
  },
  async run({ $ }) {
    const rules = [];
    for (let i = 1; i <= this.rules; i++) {
      rules.push({
        column: this[`column_${i}`],
        relation: this[`relation_${i}`],
        condition: this[`condition_${i}`],
      });
    }

    const response = await this.shopify.createCollection({
      input: {
        title: this.title,
        ruleSet: {
          appliedDisjunctively: this.disjunctive,
          rules,
        },
      },
    });
    if (response.collectionCreate.userErrors.length > 0) {
      throw new Error(response.collectionCreate.userErrors[0].message);
    }
    $.export("$summary", `Created new smart collection \`${this.title}\` with ID \`${response.collectionCreate.collection.id}\``);
    return response;
  },
};
