// Pipedream component: Screen Entity (Palavir Compliance)
//
// Action that screens one individual or entity against LEIE, OFAC SDN, and SAM.gov
// exclusion databases via the Palavir Compliance API.

import palavir_compliance from "../../palavir_compliance.app.mjs";

export default {
  key: "palavir_compliance-screen-entity",
  name: "Screen Entity (LEIE + OFAC + SAM)",
  description:
    "Screen one individual or entity against LEIE (OIG exclusion), OFAC SDN (Treasury sanctions), and SAM.gov (federal contractor exclusion). Returns risk level (CLEAR | POTENTIAL | MATCH) plus match details. [See the documentation](https://palavir.co/exclusion-screening)",
  type: "action",
  version: "0.0.1",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    palavir_compliance,
    name: {
      type: "string",
      label: "Name",
      description: "Full name of individual or entity to screen",
    },
    npi: {
      type: "string",
      label: "NPI (optional)",
      description: "10-digit NPI for healthcare providers — boosts LEIE confidence to 1.0",
      optional: true,
    },
    state: {
      type: "string",
      label: "State (optional)",
      description: "Two-letter US state code",
      optional: true,
    },
    dob: {
      type: "string",
      label: "Date of Birth (optional, YYYY-MM-DD)",
      description: "Boosts confidence on common names",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      name: this.name,
      ...(this.npi && { npi: this.npi }),
      ...(this.state && { state: this.state }),
      ...(this.dob && { dob: this.dob }),
    };

    const response = await this.palavir_compliance.screenEntity($, data);

    $.export("$summary", `Screened ${this.name} — risk level: ${response?.risk_level ?? "unknown"}`);
    return response;
  },
};
