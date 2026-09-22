import ionosHostingServices from "../../ionos_hosting_services.app.mjs";

export default {
  key: "ionos_hosting_services-get-dns-record",
  name: "Get DNS Record",
  description: "Get a single DNS record from a zone by its record ID. Returns the record object, for example `{\"id\":\"rec-uuid\",\"name\":\"www.example.com\",\"type\":\"A\",\"content\":\"5.6.7.8\",\"ttl\":3600}` (full fields include `rootName`, `prio`, `disabled`, `changeDate`). Run **List DNS Zones** to find the zone ID and **Get DNS Zone** to find the record ID. [See the documentation](https://developer.hosting.ionos.com/docs/dns).",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
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
    recordId: {
      propDefinition: [
        ionosHostingServices,
        "recordId",
      ],
    },
  },
  async run({ $ }) {
    const record = await this.ionosHostingServices.getRecord({
      $,
      zoneId: this.zoneId,
      recordId: this.recordId,
    });
    $.export("$summary", `Retrieved record ${record.id}: ${record.name} (${record.type})`);
    return record;
  },
};
