import shopify from "../../shopify.app.mjs";
import { rules } from "../common/rules.mjs";
import { toSingleLineString } from "../commons.mjs";

export default {
  key: "shopify-create-smart-collection",
  name: "Create Smart Collection",
  description: toSingleLineString(`
    Creates a smart collection.
    You can fill in any number of rules by selecting more than one option in each prop.
    [See docs](https://shopify.dev/api/admin-rest/2021-10/resources/smartcollection#post-smart-collections)
  `),
  version: "0.0.1",
  type: "action",
  props: {
    shopify,
    title: {
      propDefinition: [
        shopify,
        "title",
      ],
      description: "Title of the smart collection",
    },
    columns: {
      type: "string[]",
      label: "Rule: Column",
      description: "The property of a product being used to populate the smart collection",
      options: rules.column,
    },
    relations: {
      type: "string[]",
      label: "Rule: Relation",
      description: "The relationship between the column choice and the condition",
      options: rules.relation,
    },
    conditions: {
      type: "string[]",
      label: "Rule: Condition",
      description: "Select products for a smart collection using a condition. Values are either strings or numbers, depending on the relation value",
    },
    disjunctive: {
      type: "boolean",
      label: "Disjunctive",
      description: "If `false`, the product must match all the rules to be included in the smart collection. Otherwise, it only needs to match at lease one rule",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const params = {
      title: this.title,
      disjunctive: this.disjunctive,
      rules: [],
    };
    const minLength = Math.min(
      this.columns.length,
      this.relations.length,
      this.conditions.length,
    );
    for (let i = 0; i < minLength; i++) {
      params.rules.push({
        column: this.columns[i],
        relation: this.relations[i],
        condition: this.conditions[i],
      });
    }
    const response = (await this.shopify.createSmartCollection(params)).result;
    $.export("$summary", `Created new smart collection \`${response.title}\` with id \`${response.id}\``);
    return response;
  },
};
