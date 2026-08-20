// x-pd-ai: optimized
import ionosHostingServices from "../../ionos_hosting_services.app.mjs";

export default {
  key: "ionos_hosting_services-delete-dns-record",
  name: "Delete DNS Record",
  description: "Permanently delete a single DNS record from a zone by its record ID. This cannot be undone. Run **Get DNS Zone** to find the record ID. [See the documentation](https://developer.hosting.ionos.com/docs/dns).",
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
    recordId: {
      propDefinition: [
        ionosHostingServices,
        "recordId",
      ],
    },
  },
  async run({ $ }) {
    const result = await this.ionosHostingServices.deleteRecord({
      $,
      zoneId: this.zoneId,
      recordId: this.recordId,
    });
    $.export("$summary", `Deleted record ${this.recordId} from zone ${this.zoneId}`);
    return result;
  },
};
