import { defineAction } from "@pipedream/types";
import app from "../../app/concord.app";
import { AGREEMENT_STATUS_OPTIONS } from "../../common/constants";

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
      propDefinition: [app, "organizationId"],
    },
    source: {
      type: "object",
      label: "Source",
      description:
        "Source agreement information. Used when an agreement is created from another agreement. Currently only contract and templates are supported as source agreement. It also allows to supply parameters for template containing variables. It allows draft creation from template and copying a contract.",
      optional: true,
    },
    folderId: {
      propDefinition: [
        app,
        "folderId",
        ({ organizationId }) => ({ organizationId }),
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "Agreement status",
      options: AGREEMENT_STATUS_OPTIONS,
    },
    parametersSource: {
      type: "string",
      label: "Parameters Source",
      description:
        "Define parameters source for agreements of status `TEMPLATE` (ignored for other statuses)",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Agreement title",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Agreement description",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Agreement tags",
      optional: true,
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
