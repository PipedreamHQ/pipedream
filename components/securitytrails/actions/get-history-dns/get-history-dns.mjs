import app from "../../securitytrails.app.mjs";

export default {
  key: "securitytrails-get-history-dns",
  name: "Get Historical DNS",
  description: "Lists out specific historical information about the given hostname parameter. [See the documentation](https://docs.securitytrails.com/reference/history-dns)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    hostname: {
      propDefinition: [
        app,
        "hostname",
      ],
    },
    type: {
      type: "string",
      label: "Record Type",
      description: "Select the DNS record type to query historical data for.",
      options: [
        {
          label: "A",
          value: "a",
        },
        {
          label: "AAAA",
          value: "aaaa",
        },
        {
          label: "MX",
          value: "mx",
        },
        {
          label: "NS",
          value: "ns",
        },
        {
          label: "SOA",
          value: "soa",
        },
        {
          label: "TXT",
          value: "txt",
        },
      ],
    },
  },
  methods: {
    getHistoryDns({
      hostname, type, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/history/${hostname}/dns/${type}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getHistoryDns,
      hostname,
      type,
    } = this;

    const response = await getHistoryDns({
      $,
      hostname,
      type,
    });
    $.export("$summary", `Successfully retrieved historical DNS data for type \`${response.type}\`.`);
    return response;
  },
};
