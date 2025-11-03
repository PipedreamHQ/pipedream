import cloudflare from "../../cloudflare_api_key.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "cloudflare_api_key-create-zone",
  name: "Create Zone",
  description: "Create Zone. [See the docs here](https://api.cloudflare.com/#zone-create-zone)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cloudflare,
    name: {
      type: "string",
      label: "Name",
      description: "The domain name",
    },
    account: {
      propDefinition: [
        cloudflare,
        "accountIdentifier",
      ],
    },
    jumpStart: {
      type: "boolean",
      label: "Jump Start",
      description: "Automatically attempt to fetch existing DNS records",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "A full zone implies that DNS is hosted with Cloudflare. A partial zone is typically a partner-hosted zone or a CNAME setup",
      options: constants.ZONE_TYPE_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const zoneData = {
      name: this.name,
      account: {
        id: this.account,
      },
      jump_start: this.jumpStart,
      type: this.type,
    };

    const response = await this.cloudflare.createZone(zoneData);
    $.export("$summary", `Successfully created zone with ID ${response.result.id}`);

    return response;
  },
};
