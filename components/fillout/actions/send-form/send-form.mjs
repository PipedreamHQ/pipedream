import fillout from "../../fillout.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "fillout-send-form",
  name: "Send Form",
  description: "Sends a specified form to designated emails. [See the documentation](https://www.fillout.com/help/oauth-applications)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    fillout,
    form: {
      propDefinition: [
        fillout,
        "form",
      ],
    },
    email: {
      propDefinition: [
        fillout,
        "email",
      ],
    },
    cc: {
      propDefinition: [
        fillout,
        "cc",
      ],
    },
    bcc: {
      propDefinition: [
        fillout,
        "bcc",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fillout.sendForm({
      form: this.form,
      email: this.email,
      cc: this.cc,
      bcc: this.bcc,
    });
    $.export("$summary", `Form sent successfully to ${this.email.length} email(s)`);
    return response;
  },
};
