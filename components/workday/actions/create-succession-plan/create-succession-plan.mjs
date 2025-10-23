import workday from "../../workday.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "workday-create-succession-plan",
  name: "Create Succession Plan",
  description: "Create a new succession plan. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#talentManagement/v2/post-/successionPlans)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    workday,
    position: {
      type: "object",
      label: "Position",
      description: "The position associated with the succession plan. Example: `{ \"id\": \"00000000000000000000000000000000\" }`",
    },
    supervisoryOrg: {
      type: "object",
      label: "Supervisory Organization",
      description: "The organization associated with the succession plan. Example: `{ \"id\": \"00000000000000000000000000000000\" }`",
    },
    successionPlan: {
      type: "object",
      label: "Succession Plan",
      description: "The reference to the succession plan instance. Example: `{ \"id\": \"00000000000000000000000000000000\" }`",
    },
    descriptor: {
      type: "string",
      label: "Descriptor",
      description: "Display name of the instance.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (
      !this.position || typeof this.position !== "object" || !this.position.id || !this.position.id.trim()
    ) {
      throw new ConfigurationError("Position is required and must be an object with a non-empty id property.");
    }
    if (
      !this.supervisoryOrg || typeof this.supervisoryOrg !== "object" || !this.supervisoryOrg.id || !this.supervisoryOrg.id.trim()
    ) {
      throw new ConfigurationError("Supervisory Organization is required and must be an object with a non-empty id property.");
    }
    if (
      !this.successionPlan || typeof this.successionPlan !== "object" || !this.successionPlan.id || !this.successionPlan.id.trim()
    ) {
      throw new ConfigurationError("Succession Plan is required and must be an object with a non-empty id property.");
    }

    const data = {
      position: this.position,
      supervisoryOrg: this.supervisoryOrg,
      successionPlan: this.successionPlan,
    };
    if (this.descriptor) data.descriptor = this.descriptor;

    const response = await this.workday.createSuccessionPlan({
      $,
      data,
    });
    $.export("$summary", "Succession plan created");
    return response;
  },
};
