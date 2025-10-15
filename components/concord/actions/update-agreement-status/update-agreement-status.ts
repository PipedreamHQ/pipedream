import { defineAction } from "@pipedream/types";
import app from "../../app/concord.app";
import { AGREEMENT_PATCH_STATUS_OPTIONS } from "../../common/constants";
import { PatchAgreementParams } from "../../common/types/requestParams";

export default defineAction({
  name: "Update Agreement Status",
  description:
    "Update an agreement's status [See the documentation](https://api.doc.concordnow.com/#tag/Agreement/operation/PatchAgreement)",
  key: "concord-update-agreement-status",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
        ({ organizationId }: { organizationId: number; }) => ({
          organizationId,
        }),
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "Agreement status",
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
