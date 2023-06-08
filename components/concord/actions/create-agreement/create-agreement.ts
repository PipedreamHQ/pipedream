import { defineAction } from "@pipedream/types";
import app from "../../app/concord.app";

export default defineAction({
  name: "Create Agreement",
  description:
    "Create an agreement [See the documentation](https://api.doc.concordnow.com/#tag/Agreement/operation/AgreementCreate)",
  key: "concord-create-agreement",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    organizationId: {
      type: "string",
      label: "Organization ID",
      description:
        "",
    },
  },
  async run({ $ }) {
    const { organizationId } = this;

    const params = {
      $,
      organizationId,
    };

    const response = await this.app.createAgreement(params);
    $.export("$summary", "Created agreement");
    return response;
  },
});
