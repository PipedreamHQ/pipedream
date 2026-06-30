import superdocu from "../../superdocu.app.mjs";
import { LOCALE_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "superdocu-create-contact",
  name: "Create Contact",
  description: "Create a new contact in Superdocu. Returns the created contact including its `id`, which you can then pass as **contactId** to **Create Dossier** to assign a workflow. [See the documentation](https://developers.superdocu.com/api/index.html).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    superdocu,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The contact's first name.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email address, e.g. `jane.doe@acme.com`.",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The contact's phone number.",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The contact's company name.",
      optional: true,
    },
    companySiret: {
      type: "string",
      label: "Company SIRET",
      description: "14-digit SIRET identifier for the contact's company, e.g. `73282932000074`. Find the SIRET on a company's detail page in Superdocu or from an official business registry.",
      optional: true,
    },
    companySiren: {
      type: "string",
      label: "Company SIREN",
      description: "9-digit SIREN identifier for the contact's company, e.g. `732829320` (the first 9 digits of the SIRET). Find the SIREN on a company's detail page in Superdocu or from an official business registry.",
      optional: true,
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "The contact's locale. One of: `en`, `fr`, `de`, `nl`, `pt`, `es`.",
      options: LOCALE_OPTIONS,
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Free-text notes about the contact.",
      optional: true,
    },
    tagIds: {
      type: "string[]",
      label: "Tag IDs",
      description: "Integer IDs of tags to assign to the contact, e.g. `[123, 456]`. Find tag IDs in the Tags section of your Superdocu account settings.",
      optional: true,
    },
    trackingParams: {
      type: "object",
      label: "Tracking Params",
      description: "Arbitrary tracking parameters as a JSON object, e.g. `{\"utm_source\": \"newsletter\"}`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.superdocu.createContact({
      $,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        phone: this.phone,
        company_name: this.companyName,
        company_siret: this.companySiret,
        company_siren: this.companySiren,
        locale: this.locale,
        notes: this.notes,
        tag_ids: this.tagIds
          ?.filter((id) => /^\d+$/.test(String(id).trim()))
          .map(Number),
        tracking_params: this.trackingParams,
      },
    });
    $.export("$summary", `Successfully created contact ${response.data?.id}`);
    return response;
  },
};
