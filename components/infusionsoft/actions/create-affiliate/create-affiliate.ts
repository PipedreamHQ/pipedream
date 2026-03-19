import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";
import { CreateAffiliateParams } from "../../types/requestParams";

export default defineAction({
  name: "Create Affiliate",
  description:
    "Create a new affiliate in Keap CRM. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Affiliate)",
  key: "infusionsoft-create-affiliate",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    infusionsoft,
    code: {
      type: "string",
      label: "Affiliate Code",
      description:
        "The affiliate code. Must start with letters, be at least 4 characters, and contain no spaces.",
      optional: false,
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description:
        "The ID of the contact to associate with this affiliate. Must be a positive number.",
      optional: false,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the affiliate.",
      optional: false,
      options: [
        {
          label: "Active",
          value: "ACTIVE",
        },
        {
          label: "Inactive",
          value: "INACTIVE",
        },
      ],
    },
    name: {
      type: "string",
      label: "Affiliate Name",
      description:
        "The name of the affiliate. If not provided, it will be derived from the associated contact.",
      optional: true,
    },
  },
  async run({ $ }): Promise<object> {
    const affiliateCode = String(this.code).trim();
    if (!affiliateCode) {
      throw new Error("Affiliate code is required");
    }
    if (!/^[a-zA-Z][^\s]{3,}$/.test(affiliateCode)) {
      throw new Error(
        "Affiliate code must start with a letter, be at least 4 characters, and contain no spaces",
      );
    }

    const contactId = String(this.contactId ?? "").trim();
    if (!contactId) {
      throw new Error("Contact ID is required");
    }
    const contactIdNum = parseInt(contactId, 10);
    if (!Number.isFinite(contactIdNum) || contactIdNum < 1) {
      throw new Error("Contact ID must be a positive number");
    }

    const affiliateStatus = String(this.status).trim()
      .toUpperCase();
    if (![
      "ACTIVE",
      "INACTIVE",
    ].includes(affiliateStatus)) {
      throw new Error("Status must be ACTIVE or INACTIVE");
    }

    const params: CreateAffiliateParams = {
      $,
      code: affiliateCode,
      contactId: String(contactIdNum),
      status: affiliateStatus,
      name: this.name,
    };

    const result = await this.infusionsoft.createAffiliate(params);

    $.export(
      "$summary",
      `Successfully created affiliate with code "${affiliateCode}"`,
    );

    return result;
  },
});
