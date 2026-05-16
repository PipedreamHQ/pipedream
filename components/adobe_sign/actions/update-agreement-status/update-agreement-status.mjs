import adobe_sign from "../../adobe_sign.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "adobe_sign-update-agreement-status",
  name: "Update Agreement Status",
  description: "Alters the status of an existing agreement in Adobe Sign. [See the documentation](https://opensource.adobe.com/acrobat-sign/developer_guide/index.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    adobe_sign,
    agreementId: {
      propDefinition: [
        adobe_sign,
        "agreementId",
      ],
    },
    value: {
      type: "string",
      label: "New Status Value",
      description: "The new status value for the agreement (e.g., CANCELLED)",
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "An optional comment describing why the status is being updated",
      optional: true,
    },
    notifySigner: {
      type: "boolean",
      label: "Notify Signer",
      description: "Whether or not you would like the signer to be emailed the cancellation",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      state: this.value,
    };

    if (this.comment) {
      data.comment = this.comment;
    }

    if (this.notifySigner !== undefined) {
      data.notifySigner = this.notifySigner;
    }

    const response = await this.adobe_sign.updateAgreementStatus({
      agreementId: this.agreementId,
      ...data,
    });

    $.export("$summary", `Successfully updated the status of agreement ${this.agreementId} to ${this.value}`);
    return response;
  },
};
