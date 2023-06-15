import { defineAction } from "@pipedream/types";
import app from "../../app/concord.app";
import { CreateAgreementParams } from "../../common/types/requestParams";
import { CreateAgreementResponse } from "../../common/types/responseSchemas";

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
      propDefinition: [
        app,
        "organizationId",
      ],
    },
    folderId: {
      propDefinition: [
        app,
        "folderId",
        ({ organizationId }: { organizationId: number; }) => ({
          organizationId,
        }),
      ],
    },
    source: {
      type: "object",
      label: "Source",
      description:
        "Source agreement information. Used when an agreement is created from another agreement. Currently only contract and templates are supported as source agreement. It also allows to supply parameters for template containing variables. It allows draft creation from template and copying a contract.",
      optional: true,
    },
    status: {
      propDefinition: [
        app,
        "status",
      ],
    },
    parametersSource: {
      type: "string",
      label: "Parameters Source",
      description:
        "Define parameters source for agreements of status `TEMPLATE` (ignored for other statuses)",
      optional: true,
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
    const {
      organizationId,
      folderId,
      status,
      parametersSource,
      title,
      description,
      tags,
    } = this;

    const params: CreateAgreementParams = {
      $,
      organizationId,
      data: {
        organizationId,
        folderId,
        status,
        parametersSource,
        title,
        description,
        tags,
      },
    };

    const response: CreateAgreementResponse = await this.app.createAgreement(params);
    $.export("$summary", `Successfully created agreement (ID: ${response.uid})`);
    return response;
  },
});
