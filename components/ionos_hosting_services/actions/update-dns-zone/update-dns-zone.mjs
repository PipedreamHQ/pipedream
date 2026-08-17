// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import ionosHostingServices from "../../ionos_hosting_services.app.mjs";

export default {
  key: "ionos_hosting_services-update-dns-zone",
  name: "Update DNS Zone (Full Replace)",
  description: "Replace ALL records in a DNS zone with the provided record set (HTTP PUT / full zone overwrite). Any existing record not present in the payload is permanently removed. For a partial update that only replaces records sharing the same name and type, use **Patch DNS Zone** instead. Run **List DNS Zones** to find the zone ID and **Get DNS Zone** to inspect current records first. [See the documentation](https://developer.hosting.ionos.com/docs/dns).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
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
      description: "JSON array of record objects that will REPLACE all records in the zone. Each object: `{ \"name\": \"www.example.com\", \"type\": \"A\", \"content\": \"5.6.7.8\", \"ttl\": 3600, \"prio\": 0, \"disabled\": false }`. `name`, `type`, and `content` are required; `name` must be the fully-qualified domain name including the zone domain (e.g. `www.example.com`) - a short name like `www` is invalid. `type` must be one of the DNS record type constants (e.g. `A`, `AAAA`, `CNAME`, `MX`, `TXT`). Example: `[{\"name\":\"www.example.com\",\"type\":\"A\",\"content\":\"5.6.7.8\",\"ttl\":3600}]`.",
    },
  },
  async run({ $ }) {
    let records;
    try {
      records = JSON.parse(this.records);
    } catch {
      throw new ConfigurationError("The `records` field must be a valid JSON array of record objects.");
    }
    if (!Array.isArray(records)) {
      throw new ConfigurationError("The `records` field must be a valid JSON array of record objects.");
    }
    const result = await this.ionosHostingServices.updateZone({
      $,
      zoneId: this.zoneId,
      data: records,
    });
    $.export("$summary", `Replaced all records in zone ${this.zoneId} with ${records.length} record${records.length === 1
      ? ""
      : "s"}`);
    return result;
  },
};
