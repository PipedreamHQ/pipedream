import productboard from "../../productboard.app.mjs";
import { getParentProp } from "../common/utils.mjs";

export default {
  key: "productboard-create-feature",
  name: "Create Feature",
  description: "Create a new feature. [See the docs here](https://developer.productboard.com/#operation/createFeature)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    productboard,
    name: {
      propDefinition: [
        productboard,
        "name",
      ],
    },
    description: {
      propDefinition: [
        productboard,
        "description",
      ],
    },
    status: {
      propDefinition: [
        productboard,
        "featureStatus",
      ],
      description: "The status of the new feature",
    },
    parentType: {
      propDefinition: [
        productboard,
        "parentType",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {
      parent: this.getParentProp(),
    };
    if (this.parentType === "feature") {
      props.parent.description = "Parent of the new feature";
    }
    return props;
  },
  methods: {
    getParentProp,
  },
  async run({ $ }) {
    const parent = {};
    parent[this.parentType] = {
      id: this.parent,
    };
    const data = {
      data: {
        name: this.name,
        description: this.description,
        type: this.parentType === "feature"
          ? "subfeature"
          : "feature",
        status: {
          id: this.status,
        },
        parent,
      },
    };
    const { data: feature } = await this.productboard.createFeature(data, $);

    $.export("$summary", `Successfully created feature with ID ${feature.id}`);

    return feature;
  },
};
