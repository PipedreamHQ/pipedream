// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import ionosHostingServices from "../../ionos_hosting_services.app.mjs";

export default {
  key: "ionos_hosting_services-patch-dns-zone",
  name: "Patch DNS Zone",
  description: "Partially update a DNS zone (HTTP PATCH): for each provided record, all existing records sharing the same name and type are replaced with the provided ones. Records with other name/type combinations are left untouched. For a full zone overwrite use **Update DNS Zone (Full Replace)** instead. Run **List DNS Zones** to find the zone ID. [See the documentation](https://developer.hosting.ionos.com/docs/dns).",
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
      description: "JSON array of record objects to apply. For each name+type in this list, matching records in the zone are replaced. Each object: `{ \"name\": \"www.example.com\", \"type\": \"A\", \"content\": \"5.6.7.8\", \"ttl\": 3600, \"prio\": 0, \"disabled\": false }`. `name`, `type`, and `content` are required; `type` must be one of the DNS record type constants (e.g. `A`, `AAAA`, `CNAME`, `MX`, `TXT`). Example: `[{\"name\":\"www.example.com\",\"type\":\"A\",\"content\":\"5.6.7.8\",\"ttl\":3600}]`.",
    },
  },
  async run({ $ }) {
    let records;
    try {
      records = JSON.parse(this.records);
    } catch {
      throw new ConfigurationError("The `records` field must be a valid JSON array of record objects.");
    }
    const result = await this.ionosHostingServices.patchZone({
      $,
      zoneId: this.zoneId,
      data: records,
    });
    $.export("$summary", `Patched zone ${this.zoneId} with ${records.length} record${records.length === 1
      ? ""
      : "s"}`);
    return result;
  },
};
