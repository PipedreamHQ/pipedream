import { defineAction } from "@pipedream/types";
import app from "../../app/concord.app";
import { CreateTemplateParams } from "../../common/types/requestParams";
import { CreateAgreementResponse } from "../../common/types/responseSchemas";

export default defineAction({
  name: "Create Template",
  description:
    "Create a template [See the documentation](https://api.doc.concordnow.com/#tag/Agreement/operation/AgreementCreate)",
  key: "concord-create-template",
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
    title: {
      type: "string",
      label: "Title",
      description: "Template title",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Template description",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Template tags",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      organizationId,
      folderId,
      title,
      description,
      tags,
    } = this;

    const params: CreateTemplateParams = {
      $,
      organizationId,
      data: {
        organizationId,
        folderId,
        title,
        description,
        tags,
        status: "TEMPLATE"
      },
    };

    const response: CreateAgreementResponse = await this.app.createAgreement(params);
    $.export("$summary", `Successfully created template (ID: ${response.uid})`);
    return response;
  },
});
