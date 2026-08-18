// x-pd-ai: optimized
import ionosHostingServices from "../../ionos_hosting_services.app.mjs";
import { DNS_RECORD_TYPES } from "../../common/constants.mjs";

export default {
  key: "ionos_hosting_services-get-dns-zone",
  name: "Get DNS Zone",
  description: "Get a single DNS zone including its `records` array. This is also the only way to list a zone's DNS records (there is no dedicated list-records endpoint) - use the optional `nameFilter` and `recordType` filters to narrow the returned records, and read each record's `id` for use in the record-level actions. Returns an object like `{\"id\":\"4ab3a7e2-1234-5678-abcd-ef0123456789\",\"name\":\"example.com\",\"type\":\"NATIVE\",\"records\":[{\"id\":\"90d81ac0-3a30-44d4-95a5-12959effa6ee\",\"name\":\"www.example.com\",\"type\":\"A\",\"content\":\"5.6.7.8\",\"ttl\":3600}]}`. Run **List DNS Zones** first to obtain a zone ID. [See the documentation](https://developer.hosting.ionos.com/docs/dns).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
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
    nameFilter: {
      type: "string",
      label: "Name Filter",
      description: "Optional filter to return only records whose name contains this string (case-insensitive). Example: `kramer` will match records named `kramer.example.com`.",
      optional: true,
    },
    recordType: {
      type: "string[]",
      label: "Record Type",
      description: "Optional record type(s) to filter by. Select one or more; they are sent to the API as a comma-separated string.",
      options: DNS_RECORD_TYPES,
      optional: true,
    },
  },
  async run({ $ }) {
    const zone = await this.ionosHostingServices.getZone({
      $,
      zoneId: this.zoneId,
      params: {
        recordType: this.recordType?.length
          ? this.recordType.join(",")
          : undefined,
      },
    });
    if (this.nameFilter && zone?.records) {
      const filter = this.nameFilter.toLowerCase();
      zone.records = zone.records.filter((r) => r.name.toLowerCase().includes(filter));
    }
    const recordCount = zone?.records?.length ?? 0;
    $.export("$summary", `Retrieved zone ${zone?.name ?? this.zoneId} with ${recordCount} record${recordCount === 1
      ? ""
      : "s"}`);
    return zone;
  },
};
