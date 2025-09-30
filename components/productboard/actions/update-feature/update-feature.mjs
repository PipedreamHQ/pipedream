import productboard from "../../productboard.app.mjs";
import { getParentProp } from "../common/utils.mjs";

export default {
  key: "productboard-update-feature",
  name: "Update Feature",
  description: "Update an existing feature. [See the docs here](https://developer.productboard.com/#operation/updateFeature)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    productboard,
    feature: {
      propDefinition: [
        productboard,
        "feature",
      ],
      description: "The feature to update",
    },
    name: {
      propDefinition: [
        productboard,
        "name",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        productboard,
        "description",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        productboard,
        "featureStatus",
      ],
      description: "Feature status",
      optional: true,
    },
    parentType: {
      propDefinition: [
        productboard,
        "parentType",
      ],
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    if (this.parentType) {
      const props = {
        parent: this.getParentProp(),
      };
      if (this.parentType === "feature") {
        props.parent.description = "Parent of the feature";
      }
      return props;
    }
    return {};
  },
  methods: {
    getParentProp,
  },
  async run({ $ }) {
    const data = {
      data: {},
    };
    if (this.name) {
      data.data.name = this.name;
    }
    if (this.description) {
      data.data.description = this.description;
    }
    if (this.status) {
      data.data.status = {
        id: this.status,
      };
    }
    if (this.parentType) {
      data.data.parent = {
        [this.parentType]: {
          id: this.parent,
        },
      };
    }
    const { data: feature } = await this.productboard.updateFeature(this.feature, data, $);

    $.export("$summary", `Successfully updated feature with ID ${feature.id}`);

    return feature;
  },
};
