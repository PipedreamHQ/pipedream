import canva from "../../canva_enterprise.app.mjs";
import common from "@pipedream/canva/actions/create-design/create-design.mjs";
import constants from "@pipedream/canva/common/constants.mjs";

export default {
  ...common,
  key: "canva_enterprise-create-design",
  name: "Create Design",
  description: "Creates a new Canva design. [See the documentation](https://www.canva.dev/docs/connect/api-reference/designs/create-design/)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    canva,
    designType: {
      type: "string",
      label: "Design Type",
      description: "The desired design type",
      reloadProps: true,
      options: constants.DESIGN_TYPE_OPTIONS,
    },
    title: {
      propDefinition: [
        canva,
        "title",
      ],
      optional: true,
    },
    assetId: {
      type: "string",
      label: "Asset ID",
      description: "The ID of the asset to add to the new design",
      optional: true,
    },
  },
};
