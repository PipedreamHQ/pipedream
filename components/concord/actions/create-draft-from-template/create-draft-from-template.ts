import { defineAction } from "@pipedream/types";
import app from "../../app/concord.app";
import { CreateAgreementParams } from "../../common/types/requestParams";
import { CreateAgreementResponse } from "../../common/types/responseSchemas";

export default defineAction({
  name: "Create Draft from Template",
  description:
    "Create a Draft from a Template [See the documentation](https://api.doc.concordnow.com/#tag/Agreement/operation/AgreementCreate)",
  key: "concord-create-draft-from-template",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    folderId: {
      propDefinition: [
        app,
        "folderId",
        ({ organizationId }: { organizationId: number; }) => ({
          organizationId,
        }),
      ],
    },
    templateUid: {
      propDefinition: [
        app,
        "templateUid",
        ({ organizationId }: { organizationId: number; }) => ({
          organizationId,
        }),
      ],
    },
    templatingParameters: {
      type: "object",
      label: "Template Parameters",
      description:
        "Key-value map for templating parameters replacement when creating an agreement from a parameterized template.",
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
    },
  },
  async run({ $ }) {
    const {
      organizationId,
      folderId,
      templateUid,
      templatingParameters,
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
        source: {
          uid: templateUid,
          templatingParameters,
        },
        title,
        description,
        tags,
        status: "DRAFT",
      },
    };

    const response: CreateAgreementResponse = await this.app.createAgreement(params);
    $.export("$summary", `Successfully created draft (ID: ${response.uid})`);
    return response;
  },
});
