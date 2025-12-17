import canva from "../../canva_enterprise.app.mjs";
import common from "@pipedream/canva/actions/export-design/export-design.mjs";
import constants from "@pipedream/canva/common/constants.mjs";

export default {
  ...common,
  key: "canva_enterprise-export-design",
  name: "Export Design",
  description: "Starts a new job to export a file from Canva. [See the documentation](https://www.canva.dev/docs/connect/api-reference/exports/create-design-export-job/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    canva,
    designId: {
      propDefinition: [
        canva,
        "designId",
      ],
    },
    type: {
      type: "string",
      label: "Format Type",
      description: "The desired export format",
      reloadProps: true,
      options: constants.EXPORT_TYPES,
    },
    pages: {
      type: "integer[]",
      label: "Pages",
      description: "To specify which pages to export in a multi-page design, provide the page numbers as an array. The first page in a design is page `1`. If pages isn't specified, all the pages are exported.",
      optional: true,
    },
    waitForCompletion: {
      propDefinition: [
        canva,
        "waitForCompletion",
      ],
    },
  },
};
