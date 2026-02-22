import workday from "../../workday.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "workday-create-prospect",
  name: "Create Prospect (Required Only)",
  description: "Create a new prospect. [See documentation] (https://community.workday.com/sites/default/files/file-hosting/restapi/#recruiting/v4/post-/prospects)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    workday,
    candidate: {
      type: "object",
      label: "Candidate",
      description: "The candidate object. Must include `name.country.id`. Example: { \"name\": { \"country\": { \"id\": \"USA\" } } }",
    },
  },
  async run({ $ }) {
    if (
      !this.candidate ||
      typeof this.candidate !== "object" ||
      !this.candidate.name ||
      typeof this.candidate.name !== "object" ||
      !this.candidate.name.country ||
      typeof this.candidate.name.country !== "object" ||
      !this.candidate.name.country.id ||
      !this.candidate.name.country.id.trim()
    ) {
      throw new ConfigurationError("candidate.name.country.id is required.");
    }
    const data = {
      candidate: this.candidate,
    };
    const response = await this.workday.createProspect({
      data,
      $,
    });
    $.export("$summary", "Prospect created");
    return response;
  },
};
