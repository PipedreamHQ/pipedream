import workday from "../../workday.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "workday-update-work-contact-information-change",
  name: "Update Work Contact Information Change",
  description: "Update an existing work contact information change. [See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#person/v4/patch-/workContactInformationChanges/-ID-)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },

  type: "action",
  props: {
    workday,
    workContactInformationChangeId: {
      propDefinition: [
        workday,
        "workContactInformationChangeId",
      ],
      description: "The ID of the work contact information change.",
    },
    alternateWorkLocation: {
      type: "object",
      label: "Alternate Work Location",
      description: "Object for alternate work location. Must include at least `id`. Example: `{ id: \"...\", descriptor: \"...\"}`",
      optional: true,
    },
    descriptor: {
      type: "string",
      label: "Descriptor",
      description: "Descriptor describing this change event.",
      optional: true,
    },
    id: {
      type: "string",
      label: "ID",
      description: "Optional ID for the event (usually system-generated).",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};
    if (this.alternateWorkLocation) {
      if (
        typeof this.alternateWorkLocation !== "object"
        || !this.alternateWorkLocation.id
        || typeof this.alternateWorkLocation.id !== "string"
        || !this.alternateWorkLocation.id.length
      ) {
        throw new ConfigurationError("alternateWorkLocation must include a non-empty 'id' property.");
      }
      data.alternateWorkLocation = this.alternateWorkLocation;
    }
    if (this.descriptor) data.descriptor = this.descriptor;
    if (this.id) data.id = this.id;

    const response = await this.workday.updateWorkContactInformationChange({
      id: this.workContactInformationChangeId,
      $,
      data,
    });
    $.export("$summary", `Updated change ${this.workContactInformationChangeId}`);
    return response;
  },
};
