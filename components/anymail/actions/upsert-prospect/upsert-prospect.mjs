import anymail from "../../anymail.app.mjs";

export default {
  key: "anymail-upsert-prospect",
  name: "Create or Update Prospect",
  description: "Creates a prospect, or updates the one with the same email. Fields left empty keep their current value. Can also add the prospect to a campaign. [See the docs](https://developers.anymail.watch/prospects/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    anymail,
    email: {
      propDefinition: [
        anymail,
        "email",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Time Zone",
      description: "IANA name, for example `Europe/Warsaw`.",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Snippet values, for example `{\"role\": \"CTO\"}`.",
      optional: true,
    },
    campaignId: {
      propDefinition: [
        anymail,
        "campaignId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      anymail, email, campaignId,
    } = this;
    const existing = await anymail.findProspectByEmail({
      $,
      email,
    });
    // PATCH replaces the whole prospect, so empty inputs fall back to what is stored.
    const full = existing
      ? await anymail.getProspect({
        $,
        id: existing.id,
      })
      : {};
    const data = {
      email,
      first_name: this.firstName || full.first_name || null,
      last_name: this.lastName || full.last_name || null,
      timezone: this.timezone || full.timezone || null,
      company_name: this.companyName || full.company?.name || null,
      custom_fields: {
        ...full.custom_fields,
        ...(typeof this.customFields === "string"
          ? JSON.parse(this.customFields)
          : this.customFields),
      },
    };

    let id;
    if (existing) {
      id = existing.id;
      await anymail.updateProspect({
        $,
        id,
        data,
      });
      if (campaignId) {
        await anymail.addProspectsToCampaign({
          $,
          campaignId,
          data: {
            prospect_ids: [
              id,
            ],
          },
        });
      }
    } else {
      ({ id } = await anymail.createProspect({
        $,
        params: campaignId
          ? {
            campaign: campaignId,
          }
          : {},
        data,
      }));
    }

    const prospect = await anymail.getProspect({
      $,
      id,
    });
    $.export("$summary", `${existing
      ? "Updated"
      : "Created"} prospect ${email}`);
    return {
      ...prospect,
      created: !existing,
    };
  },
};
