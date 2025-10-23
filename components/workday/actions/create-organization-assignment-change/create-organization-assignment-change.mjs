import workday from "../../workday.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "workday-create-organization-assignment-change",
  name: "Create Organization Assignment Change",
  description: "Create a new organization assignment change compliant with Workday API structure.[See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#staffing/v7/post-/organizationAssignmentChanges)",
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
      description: "Position with at least an `id` property. Example: `{ id: \"00000000000000000000000000000000\"}`",
    },
    date: {
      type: "string",
      label: "Date",
      description: "Example: `2025-10-18T07:00:00.000Z`",
    },
    massActionWorksheet: {
      type: "object",
      label: "Mass Action Worksheet",
      description: "Mass Action Worksheet with at least an `id` property if supplied. Example: `{ id: \"00000000000000000000000000000000\"}`",
      optional: true,
    },
    massActionHeader: {
      type: "object",
      label: "Mass Action Header",
      description: "Mass Action Header with at least an `id` property if supplied. Example: `{ id: \"00000000000000000000000000000000\"}`",
      optional: true,
    },
    descriptor: {
      type: "string",
      label: "Descriptor",
      description: "Display name for the change.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.position || typeof this.position !== "object" || !this.position.id || !this.position.id.trim()) {
      throw new ConfigurationError("Position object is required, with a non-empty id property.");
    }
    if (!this.date || !this.date.trim()) {
      throw new ConfigurationError("Date is required and cannot be empty.");
    }
    if (this.massActionWorksheet !== undefined) {
      if (typeof this.massActionWorksheet !== "object" || !this.massActionWorksheet.id || !this.massActionWorksheet.id.trim()) {
        throw new ConfigurationError("If provided, Mass Action Worksheet must be an object with a non-empty id property.");
      }
    }
    if (this.massActionHeader !== undefined) {
      if (typeof this.massActionHeader !== "object" || !this.massActionHeader.id || !this.massActionHeader.id.trim()) {
        throw new ConfigurationError("If provided, Mass Action Header must be an object with a non-empty id property.");
      }
    }

    // Build payload
    const data = {
      position: this.position,
      date: this.date,
    };
    if (this.massActionWorksheet) data.massActionWorksheet = this.massActionWorksheet;
    if (this.massActionHeader) data.massActionHeader = this.massActionHeader;
    if (this.descriptor) data.descriptor = this.descriptor;

    const response = await this.workday.createOrganizationAssignmentChange({
      $,
      data,
    });
    $.export("$summary", "Created organization assignment change");
    return response;
  },
};
