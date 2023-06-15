import { defineAction } from "@pipedream/types";
import app from "../../app/concord.app";
import { AGREEMENT_PATCH_STATUS_OPTIONS, AGREEMENT_STATUS_OPTIONS } from "../../common/constants";
import { CreateAgreementParams, PatchAgreementParams } from "../../common/types/requestParams";
import { CreateAgreementResponse } from "../../common/types/responseSchemas";

export default defineAction({
  name: "Create Agreement",
  description:
    "Create an agreement [See the documentation](https://api.doc.concordnow.com/#tag/Agreement/operation/PatchAgreement)",
  key: "concord-create-agreement",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
    agreementUid: {
      propDefinition: [
        app,
        "agreementUid",
      ],
    },
    status: {
      propDefinition: [
        app,
        "status",
      ],
      options: AGREEMENT_PATCH_STATUS_OPTIONS,
    },
  },
  async run({ $ }) {
    const {
      organizationId,
      agreementUid,
      status,
    } = this;

    const params: PatchAgreementParams = {
      $,
      organizationId,
      agreementUid,
      data: {
        status,
      },
    };

    const response = await this.app.patchAgreement(params);
    $.export("$summary", "Successfully updated agreement status");
    return response;
  },
});
