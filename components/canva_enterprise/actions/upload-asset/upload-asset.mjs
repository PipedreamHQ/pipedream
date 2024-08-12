import canva from "../../canva_enterprise.app.mjs";
import common from "../../../canva/actions/upload-asset/upload-asset.mjs";

export default {
  ...common,
  key: "canva_enterprise-upload-asset",
  name: "Upload Asset",
  description: "Uploads an asset to Canva. [See the documentation](https://www.canva.dev/docs/connect/api-reference/assets/create-asset-upload-job/)",
  version: "0.0.1",
  type: "action",
  props: {
    canva,
    name: {
      type: "string",
      label: "Asset Name",
      description: "The asset's name",
    },
    filePath: {
      propDefinition: [
        canva,
        "filePath",
      ],
    },
    waitForCompletion: {
      propDefinition: [
        canva,
        "waitForCompletion",
      ],
    },
  },
};
