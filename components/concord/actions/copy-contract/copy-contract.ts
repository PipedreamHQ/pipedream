import { defineAction } from "@pipedream/types";
import app from "../../app/concord.app";
import { CreateAgreementParams } from "../../common/types/requestParams";
import { CreateAgreementResponse } from "../../common/types/responseSchemas";

export default defineAction({
  name: "Copy Contract",
  description:
    "Create a Contract from another Contract [See the documentation](https://api.doc.concordnow.com/#tag/Agreement/operation/AgreementCreate)",
  key: "concord-copy-contract",
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
    contractUid: {
      propDefinition: [
        app,
        "contractUid",
        ({ organizationId }: { organizationId: number; }) => ({
          organizationId,
        }),
      ],
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
      contractUid,
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
          uid: contractUid,
        },
        title,
        description,
        tags,
        status: "CONTRACT",
      },
    };

    const response: CreateAgreementResponse = await this.app.createAgreement(params);
    $.export("$summary", `Successfully created contract (ID: ${response.uid})`);
    return response;
  },
});
