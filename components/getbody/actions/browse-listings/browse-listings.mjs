import getbody from "../../getbody.app.mjs";

const PAGE_SIZE = 200;

export default {
  key: "getbody-browse-listings",
  name: "Browse Listings",
  description: "List the robots currently offered on GetBody, with public fields only (no owner, exact location or body IDs). [See the documentation](https://getbody.md/llms.txt)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    getbody,
    robotType: {
      propDefinition: [
        getbody,
        "robotType",
      ],
    },
    capability: {
      type: "string",
      label: "Capability",
      description: "A declared capability (`move`, `grip`, `see`, `hear_speak`, `other`) or a command name the listing offers",
      optional: true,
    },
    interfaceMode: {
      propDefinition: [
        getbody,
        "interfaceMode",
      ],
      description: "Only listings with a `real` or `simulated` body",
      optional: true,
    },
    controlMode: {
      type: "string",
      label: "Control Mode",
      description: "Only listings offering this control mode: `supervisory` (one command at a time) or `teleop` (streamed control)",
      options: [
        "supervisory",
        "teleop",
      ],
      optional: true,
    },
    online: {
      type: "boolean",
      label: "Online",
      description: "Only listings whose body is (`true`) or isn't (`false`) online now",
      optional: true,
    },
    deliverable: {
      type: "boolean",
      label: "Deliverable",
      description: "Only real bodies that can (`true`) or can't (`false`) be delivered",
      optional: true,
    },
    text: {
      type: "string",
      label: "Search Text",
      description: "Keywords; every word must appear in the robot type or model, notes, command names or descriptions",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of listings to return. Leave empty to return all of them.",
      min: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    const filters = {
      robot_type: this.robotType,
      capability: this.capability,
      interface_mode: this.interfaceMode,
      control_mode: this.controlMode,
      online: this.online,
      deliverable: this.deliverable,
      text: this.text,
    };
    const listings = [];
    let offset = 0;
    let total = Infinity;
    while (offset < total && (!this.limit || listings.length < this.limit)) {
      const pageSize = this.limit
        ? Math.min(PAGE_SIZE, this.limit - listings.length)
        : PAGE_SIZE;
      const response = await this.getbody.listPublicListings({
        $,
        params: {
          ...filters,
          limit: pageSize,
          offset,
        },
      });
      const page = response.data || [];
      listings.push(...page);
      total = parseInt(response.headers?.["x-total-count"], 10);
      if (Number.isNaN(total) || page.length < pageSize) {
        break;
      }
      offset += page.length;
    }
    $.export("$summary", `Successfully retrieved ${listings.length} listing${listings.length === 1
      ? ""
      : "s"}`);
    return listings;
  },
};
