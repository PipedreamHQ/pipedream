import { STATUS_OPTIONS } from "../../common/constants.mjs";
import {
  clearObject, parseObject,
} from "../../common/utils.mjs";
import offorte from "../../offorte.app.mjs";

export default {
  key: "offorte-create-proposal",
  name: "Create Proposal",
  description: "Create a new proposal in Offorte. [See the documentation](https://www.offorte.com/api-docs/api#tag/Proposals/operation/createProposal)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    offorte,
    accountUserId: {
      propDefinition: [
        offorte,
        "userId",
      ],
      label: "Account User ID",
      optional: true,
    },
    contactPeople: {
      propDefinition: [
        offorte,
        "contactId",
      ],
      optional: true,
      type: "string[]",
      label: "Contact People IDs",
      description: "List with people who are going to receive the proposal. These are the contacts belonging to an organisation who are going to receive the proposal. Make sure they got an email filled in.",
    },
    contactId: {
      propDefinition: [
        offorte,
        "contactId",
        () => ({
          fieldId: "contact_id",
        }),
      ],
      description: "The proposal is assigned to this main contact id",
    },
    proposalTemplateId: {
      propDefinition: [
        offorte,
        "proposalTemplateId",
      ],
    },
    designTemplateId: {
      propDefinition: [
        offorte,
        "designTemplateId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the proposal",
      optional: true,
    },
    priceTotal: {
      type: "string",
      label: "Price Total",
      description: "Proposal value as calculated by pricetables",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the proposal",
      options: STATUS_OPTIONS,
    },
    textTemplateId: {
      propDefinition: [
        offorte,
        "textTemplateId",
      ],
    },
    content: {
      type: "string[]",
      label: "Content",
      description: "A list of content items of the proposal. [See the documentation](https://www.offorte.com/api-docs/api#tag/Proposals/operation/createProposal)",
      optional: true,
    },
    tags: {
      propDefinition: [
        offorte,
        "tags",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.offorte.createProposal({
      $,
      data: clearObject({
        account_user_id: this.accountUserId,
        contact_people: parseObject(this.contactPeople),
        contact_id: this.contactId,
        proposal_template_id: this.proposalTemplateId,
        design_template_id: this.designTemplateId,
        name: this.name,
        price_total: this.priceTotal && parseFloat(this.priceTotal),
        status: this.status,
        text_template_id: this.textTemplateId,
        content: parseObject(this.content),
        tags: parseObject(this.tags),
      }),
    });

    $.export("$summary", `Created proposal with ID: ${response.id}`);
    return response;
  },
};
