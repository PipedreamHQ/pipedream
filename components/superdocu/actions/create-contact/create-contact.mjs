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
      description: "The contact's first name (maps to `first_name`).",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name (maps to `last_name`).",
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
      description: "Company name (maps to `company_name`).",
      optional: true,
    },
    companySiret: {
      type: "string",
      label: "Company SIRET",
      description: "Company SIRET identifier (maps to `company_siret`).",
      optional: true,
    },
    companySiren: {
      type: "string",
      label: "Company SIREN",
      description: "Company SIREN identifier (maps to `company_siren`).",
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
      description: "Tag IDs (integer IDs) to assign to the contact (maps to `tag_ids`).",
      optional: true,
    },
    trackingParams: {
      type: "object",
      label: "Tracking Params",
      description: "Arbitrary tracking parameters as a JSON object, e.g. `{\"utm_source\": \"newsletter\"}` (maps to `tracking_params`).",
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
        tag_ids: this.tagIds,
        tracking_params: this.trackingParams,
      },
    });
    $.export("$summary", `Successfully created contact ${response.data?.id}`);
    return response;
  },
};
