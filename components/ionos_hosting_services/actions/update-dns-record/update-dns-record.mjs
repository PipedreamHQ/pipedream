// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import ionosHostingServices from "../../ionos_hosting_services.app.mjs";

export default {
  key: "ionos_hosting_services-update-dns-record",
  name: "Update DNS Record",
  description: "Update an existing DNS record (HTTP PUT on a single record). Only `content`, `ttl`, `prio`, and `disabled` can be changed - the record's `name` and `type` are immutable via this endpoint (delete and recreate to change them). Run **Get DNS Zone** to find the record ID. [See the documentation](https://developer.hosting.ionos.com/docs/dns).",
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
    recordId: {
      propDefinition: [
        ionosHostingServices,
        "recordId",
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "New record content/value (e.g. `5.6.7.8` for an A record).",
      optional: true,
    },
    ttl: {
      type: "integer",
      label: "TTL",
      description: "New time-to-live in seconds (e.g. `3600`).",
      optional: true,
    },
    prio: {
      type: "integer",
      label: "Priority",
      description: "New priority value (used by record types such as MX and SRV).",
      optional: true,
    },
    disabled: {
      type: "boolean",
      label: "Disabled",
      description: "Whether the record is disabled (not served).",
      optional: true,
    },
  },
  async run({ $ }) {
    const noFieldsProvided = [
      this.content,
      this.ttl,
      this.prio,
      this.disabled,
    ].every((v) => v === undefined);
    if (noFieldsProvided) {
      throw new ConfigurationError("Provide at least one of Content, TTL, Priority, or Disabled to update.");
    }
    const record = await this.ionosHostingServices.updateRecord({
      $,
      zoneId: this.zoneId,
      recordId: this.recordId,
      data: {
        content: this.content,
        ttl: this.ttl,
        prio: this.prio,
        disabled: this.disabled,
      },
    });
    $.export("$summary", `Updated record ${this.recordId} in zone ${this.zoneId}`);
    return record;
  },
};
