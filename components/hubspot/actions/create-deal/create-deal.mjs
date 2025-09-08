import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common/common-create-object.mjs";

export default {
  ...common,
  key: "hubspot-create-deal",
  name: "Create Deal",
  description: "Create a deal in Hubspot. [See the documentation](https://developers.hubspot.com/docs/api/crm/deals#endpoint?spec=POST-/crm/v3/objects/deals)",
  version: "0.0.25",
  type: "action",
  props: {
    ...common.props,
    dealname: {
      type: "string",
      label: "Deal Name",
      description: "Name of the deal",
    },
    pipeline: {
      propDefinition: [
        common.props.hubspot,
        "dealPipeline",
      ],
      description: "Pipeline of the deal",
    },
    dealstage: {
      propDefinition: [
        common.props.hubspot,
        "stages",
        (c) => ({
          pipeline: c.pipeline,
        }),
      ],
      type: "string",
      description: "Stage of the deal",
    },
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.DEAL;
    },
    isDefaultProperty(property) {
      return property.name === "dealname"
        || property.name === "pipeline"
        || property.name === "dealstage";
    },
  },
};
