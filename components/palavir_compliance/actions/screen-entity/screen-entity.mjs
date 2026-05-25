// Pipedream component: Screen Entity (Palavir Compliance)
//
// Action that screens one individual or entity against LEIE, OFAC SDN, and SAM.gov
// exclusion databases via the Palavir Compliance API.
//
// Repo target: github.com/PipedreamHQ/pipedream → components/palavir_compliance/actions/screen-entity/
// Publish via PR; review typically 1-3 days.

import { axios } from "@pipedream/platform";

export default {
  key: "palavir_compliance-screen-entity",
  name: "Screen Entity (LEIE + OFAC + SAM)",
  description:
    "Screen one individual or entity against LEIE (OIG exclusion), OFAC SDN (Treasury sanctions), and SAM.gov (federal contractor exclusion). Returns risk level (CLEAR | POTENTIAL | MATCH) plus match details. [See docs](https://palavir.co/exclusion-screening).",
  type: "action",
  version: "0.1.0",
  props: {
    palavir_compliance: {
      type: "app",
      app: "palavir_compliance",
    },
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
    const body = {
      name: this.name,
      ...(this.npi && { npi: this.npi }),
      ...(this.state && { state: this.state }),
      ...(this.dob && { dob: this.dob }),
    };

    const response = await axios($, {
      method: "POST",
      url: "https://federal-exclusion-sanctions-screener.p.rapidapi.com/api/screen",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": this.palavir_compliance.$auth.api_key,
        "X-RapidAPI-Host": "federal-exclusion-sanctions-screener.p.rapidapi.com",
      },
      data: body,
    });

    $.export("$summary", `Screened ${this.name} — risk level: ${response.risk_level}`);
    return response;
  },
};
