import canva from "../../canva_enterprise.app.mjs";
import common from "../../../canva/actions/create-design-import-job/create-design-import-job.mjs";

export default {
  ...common,
  key: "canva_enterprise-create-design-import-job",
  name: "Create Design Import Job",
  description: "Starts a new job to import an external file as a new design in Canva. [See the documentation](https://www.canva.dev/docs/connect/api-reference/design-imports/create-design-import-job/)",
  version: "0.0.1",
  type: "action",
  props: {
    canva,
    title: {
      propDefinition: [
        canva,
        "title",
      ],
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
