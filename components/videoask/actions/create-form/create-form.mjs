import videoask from "../../videoask.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "videoask-create-form",
  name: "Create Form",
  description: "Creates a new form in VideoAsk. [See the documentation](https://documenter.getpostman.com/view/291373/swtedwrg)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    videoask,
    formName: {
      propDefinition: [
        videoask,
        "formName",
      ],
    },
    formSettings: {
      propDefinition: [
        videoask,
        "formSettings",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.videoask.createForm({
      formName: this.formName,
      formSettings: this.formSettings,
    });
    $.export("$summary", `Successfully created form ${this.formName}`);
    return response;
  },
};
