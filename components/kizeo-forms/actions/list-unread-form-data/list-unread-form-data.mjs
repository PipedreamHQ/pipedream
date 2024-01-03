import kizeoForms from "../../kizeo-forms.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "kizeo-forms-list-unread-form-data",
  name: "List Unread Form Data",
  description: "Retrieves a list of unread form entries/data from Kizeo Forms. [See the documentation](https://kizeo.github.io/kizeo-forms-documentations/docs/en/restv3)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    kizeoForms,
  },
  async run({ $ }) {
    const response = await this.kizeoForms.retrieveUnreadFormData();
    $.export("$summary", "Successfully retrieved unread form data");
    return response;
  },
};
