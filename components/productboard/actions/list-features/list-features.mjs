import productboard from "../../productboard.app.mjs";

export default {
  key: "productboard-list-features",
  name: "List Features",
  description: "List all features. [See the docs here](https://developer.productboard.com/#operation/getFeatures)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    productboard,
    parent: {
      propDefinition: [
        productboard,
        "feature",
      ],
      label: "Parent",
      description: "If specified, return only features that have a parent with the given ID",
      optional: true,
    },
    status: {
      propDefinition: [
        productboard,
        "featureStatus",
      ],
      optional: true,
    },
    max: {
      type: "integer",
      label: "Max",
      description: "Maximum number of features to return",
      optional: true,
      default: 100,
    },
  },
  async run({ $ }) {
    const params = {
      "status.id": this.status,
      "parent.id": this.parent,
    };
    const features = [];
    let next;
    do {
      const {
        data, links,
      } = next
        ? await this.productboard.getTarget(next, $)
        : await this.productboard.listFeatures(params, $);
      features.push(...data);
      next = links?.next;
    } while (next && features.length < this.max);

    if (features.length > this.max) {
      features.length = this.max;
    }

    $.export("$summary", `Successfully retrieved ${features.length} feature(s)`);

    return features;
  },
};
