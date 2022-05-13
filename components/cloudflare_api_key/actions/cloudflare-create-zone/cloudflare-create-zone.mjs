import cloudflare from "../../cloudflare_api_key.app.mjs";

export default {
  key: "cloudflare-create-zone",
  name: "Create Zone",
  description: "Create Zone. [See the docs here](https://api.cloudflare.com/#zone-create-zone)",
  version: "0.0.1",
  type: "action",
  props: {
    cloudflare,
    name: {
      type: "string",
      label: "Name",
      description: "The domain name",
    },
    account: {
      type: "string",
      label: "Account ID",
      description: "Account of which the zone is created in",
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
      options() {
        return [
          "full",
          "partial",
        ];
      },
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
