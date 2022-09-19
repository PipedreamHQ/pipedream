import shopify from "../../shopify.app.mjs";
import rules from "../common/rules.mjs";
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
    disjunctive: {
      type: "boolean",
      label: "Disjunctive",
      description: toSingleLineString(`
        If \`false\`, the product must match all the rules to be included in the smart collection.
        Otherwise, it only needs to match at least one rule
      `),
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
        description: toSingleLineString(`
          The property of a product being used to populate the smart collection
        `),
        options: rules.column,
      };
      props[`relation_${i}`] = {
        type: "string",
        label: `Rule ${i} - Relation`,
        description: toSingleLineString(`
          The relationship between the **column** choice, and the **condition**
        `),
        options: rules.relation,
      };
      props[`condition_${i}`] = {
        type: "string",
        label: `Rule ${i} - Condition`,
        description: toSingleLineString(`
          Select products for a smart collection using a **condition**.
          Values is either \`string\` or \`number\`, depending on the **relation** value
        `),
      };
    }
    return props;
  },
  async run({ $ }) {
    const params = {
      title: this.title,
      disjunctive: this.disjunctive,
      rules: [],
    };

    for (let i = 1; i <= this.rules; i++) {
      const column = `column_${i}`;
      const relation = `relation_${i}`;
      const condition = `condition_${i}`;

      params.rules.push({
        column: this[column],
        relation: this[relation],
        condition: this[condition],
      });
    }

    const response = await this.shopify.createSmartCollection(params);
    const { result } = response;
    $.export("$summary", `Created new smart collection \`${result.title}\` with id \`${result.id}\``);
    return result;
  },
};
