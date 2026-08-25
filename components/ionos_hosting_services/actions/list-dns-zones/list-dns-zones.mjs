// x-pd-ai: optimized
import ionosHostingServices from "../../ionos_hosting_services.app.mjs";

export default {
  key: "ionos_hosting_services-list-dns-zones",
  name: "List DNS Zones",
  description: "List all DNS zones for the authenticated IONOS Hosting Services account. Returns an array of zone objects, for example `[{\"id\":\"4ab3a7e2-1234-5678-abcd-ef0123456789\",\"name\":\"example.com\",\"type\":\"NATIVE\"}]`. Use the `id` field (not the `name` field) as the zone ID in other DNS actions. [See the documentation](https://developer.hosting.ionos.com/docs/dns).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    ionosHostingServices,
  },
  async run({ $ }) {
    const zones = (await this.ionosHostingServices.listZones({
      $,
    })) ?? [];
    $.export("$summary", `Found ${zones.length} DNS zone${zones.length === 1
      ? ""
      : "s"}`);
    return zones;
  },
};
