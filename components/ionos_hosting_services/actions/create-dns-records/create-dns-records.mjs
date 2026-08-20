// x-pd-ai: optimized
import ionosHostingServices from "../../ionos_hosting_services.app.mjs";
import { parseRecords } from "../../common/utils.mjs";

export default {
  key: "ionos_hosting_services-create-dns-records",
  name: "Create DNS Records",
  description: "Create one or more DNS records in a zone. Accepts a JSON array of record objects and returns the created records (each with a new `id`). The `name` field in each record must be the fully-qualified domain name (FQDN) including the zone domain — use `newman.example.com`, not just `newman`. Run **List DNS Zones** first to get the zone ID and zone domain name, then construct the full FQDN for each record. [See the documentation](https://developer.hosting.ionos.com/docs/dns).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    ionosHostingServices,
    zoneId: {
      propDefinition: [
        ionosHostingServices,
        "zoneId",
      ],
    },
    records: {
      type: "string",
      label: "Records",
      description: "JSON array of record objects to create. Each object: `{ \"name\": \"www.example.com\", \"type\": \"A\", \"content\": \"5.6.7.8\", \"ttl\": 3600, \"prio\": 0, \"disabled\": false }`. `name` must be the full FQDN including the zone domain (e.g. `newman.example.com`, NOT just `newman`). `name`, `type`, and `content` are required; `type` must be one of the DNS record type constants (e.g. `A`, `AAAA`, `CNAME`, `MX`, `TXT`). Example: `[{\"name\":\"www.example.com\",\"type\":\"A\",\"content\":\"5.6.7.8\",\"ttl\":3600}]`.",
    },
  },
  async run({ $ }) {
    const records = parseRecords(this.records);
    const result = await this.ionosHostingServices.createRecords({
      $,
      zoneId: this.zoneId,
      data: records,
    });
    $.export("$summary", `Created ${records.length} DNS record${records.length === 1
      ? ""
      : "s"} in zone ${this.zoneId}`);
    return result;
  },
};
