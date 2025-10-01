import app from "../../opensrs.app.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "opensrs-update-dns-records",
  name: "Update DNS Records",
  description: "Update DNS records for a specified domain. [See the documentation](https://domains.opensrs.guide/docs/set_dns_zone-).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
    },
    nameserversOk: {
      type: "string",
      label: "Nameservers OK",
      description: "Indicates whether the domain is set up to use the OpenSRS nameservers.",
      default: "0",
      options: [
        {
          label: "Domain is not set up to use the OpenSRS nameservers",
          value: "0",
        },
        {
          label: "Domain is set up to use the OpenSRS nameservers",
          value: "1",
        },
      ],
    },
    numberOfARecords: {
      type: "integer",
      label: "Number of A Records",
      description: "Number of A records to update",
      default: 0,
      reloadProps: true,
    },
    numberOfAAAARecords: {
      type: "integer",
      label: "Number of AAAA Records",
      description: "Number of AAAA records to update",
      default: 0,
      reloadProps: true,
    },
    numberOfCNAMERecords: {
      type: "integer",
      label: "Number of CNAME Records",
      description: "Number of CNAME records to update",
      default: 0,
      reloadProps: true,
    },
    numberOfMXRecords: {
      type: "integer",
      label: "Number of MX Records",
      description: "Number of MX records to update",
      default: 0,
      reloadProps: true,
    },
    numberOfTXTRecords: {
      type: "integer",
      label: "Number of TXT Records",
      description: "Number of TXT records to update",
      default: 0,
      reloadProps: true,
    },
    jsonOutput: {
      type: "boolean",
      label: "JSON Output",
      description: "Whether to output the response in JSON format.",
      optional: true,
      default: true,
    },
  },
  additionalProps() {
    const {
      numberOfARecords,
      numberOfAAAARecords,
      numberOfCNAMERecords,
      numberOfMXRecords,
      numberOfTXTRecords,
      getARecordPropDefinitions,
      getAAAARecordPropDefinitions,
      getCNAMERecordPropDefinitions,
      getMXRecordPropDefinitions,
      getTXTRecordPropDefinitions,
    } = this;

    const aRecords = utils.getAdditionalProps({
      numberOfFields: numberOfARecords,
      fieldName: "a",
      getPropDefinitions: getARecordPropDefinitions,
    });

    const aaaaRecords = utils.getAdditionalProps({
      numberOfFields: numberOfAAAARecords,
      fieldName: "aaaa",
      getPropDefinitions: getAAAARecordPropDefinitions,
    });

    const cnameRecords = utils.getAdditionalProps({
      numberOfFields: numberOfCNAMERecords,
      fieldName: "cname",
      getPropDefinitions: getCNAMERecordPropDefinitions,
    });

    const mxRecords = utils.getAdditionalProps({
      numberOfFields: numberOfMXRecords,
      fieldName: "mx",
      getPropDefinitions: getMXRecordPropDefinitions,
    });

    const txtRecords = utils.getAdditionalProps({
      numberOfFields: numberOfTXTRecords,
      fieldName: "txt",
      getPropDefinitions: getTXTRecordPropDefinitions,
    });

    return Object.assign({}, aRecords, aaaaRecords, cnameRecords, mxRecords, txtRecords);
  },
  methods: {
    getARecordPropDefinitions({
      prefix, label,
    } = {}) {
      return {
        [`${prefix}ipAddress`]: {
          type: "string",
          label: `${label} - IP Address`,
          description: "The IPv4 address for the A record. A numeric address that computers recognize eg. `123.45.54.123`.",
        },
        [`${prefix}subdomain`]: {
          type: "string",
          label: `${label} - Subdomain`,
          description: "The subdomain for the A record. The third level of the domain name, such as `www` or `ftp`.",
          optional: true,
        },
      };
    },
    getAAAARecordPropDefinitions({
      prefix, label,
    } = {}) {
      return {
        [`${prefix}ipv6Address`]: {
          type: "string",
          label: `${label} - IPv6 Address`,
          description: "The IPv6 address for the AAAA record. A numeric address that computers recognize eg. `2001:0db8:85a3:0000:0000:8a2e:0370:7334`.",
        },
        [`${prefix}subdomain`]: {
          type: "string",
          label: `${label} - Subdomain`,
          description: "The subdomain for the AAAA record. The third level of the domain name, such as `www` or `ftp`.",
        },
      };
    },
    getCNAMERecordPropDefinitions({
      prefix, label,
    } = {}) {
      return {
        [`${prefix}hostname`]: {
          type: "string",
          label: `${label} - Hostname`,
          description: "The FQDN of the domain that you want to access.",
        },
        [`${prefix}subdomain`]: {
          type: "string",
          label: `${label} - Subdomain`,
          description: "The third level of the domain name, such as `www` or `ftp`.",
        },
      };
    },
    getMXRecordPropDefinitions({
      prefix, label,
    } = {}) {
      return {
        [`${prefix}priority`]: {
          type: "string",
          label: `${label} - Priority`,
          description: "The priority of the target host, lower value means more preferred.",
          optional: true,
        },
        [`${prefix}hostname`]: {
          type: "string",
          label: `${label} - Hostname`,
          description: "The FQDN of the domain that you want to access.",
        },
        [`${prefix}subdomain`]: {
          type: "string",
          label: `${label} - Subdomain`,
          description: "The third level of the domain name, such as `www` or `ftp`.",
        },
      };
    },
    getTXTRecordPropDefinitions({
      prefix, label,
    } = {}) {
      return {
        [`${prefix}subdomain`]: {
          type: "string",
          label: `${label} - Subdomain`,
          description: "The third level of the domain name, such as `www` or `ftp`.",
        },
        [`${prefix}text`]: {
          type: "string",
          label: `${label} - Text`,
          description: "The text content for the TXT record.",
        },
      };
    },
    aRecordPropsMapper(prefix) {
      const {
        [`${prefix}ipAddress`]: ipAddress,
        [`${prefix}subdomain`]: subdomain,
      } = this;
      return {
        dt_assoc: {
          item: [
            ...utils.addItem("subdomain", subdomain),
            ...utils.addItem("ip_address", ipAddress),
          ],
        },
      };
    },
    aaaaRecordPropsMapper(prefix) {
      const {
        [`${prefix}ipv6Address`]: ipv6Address,
        [`${prefix}subdomain`]: subdomain,
      } = this;
      return {
        dt_assoc: {
          item: [
            ...utils.addItem("subdomain", subdomain),
            ...utils.addItem("ipv6_address", ipv6Address),
          ],
        },
      };
    },
    cnameRecordPropsMapper(prefix) {
      const {
        [`${prefix}hostname`]: hostname,
        [`${prefix}subdomain`]: subdomain,
      } = this;
      return {
        dt_assoc: {
          item: [
            ...utils.addItem("subdomain", subdomain),
            ...utils.addItem("hostname", hostname),
          ],
        },
      };
    },
    mxRecordPropsMapper(prefix) {
      const {
        [`${prefix}priority`]: priority,
        [`${prefix}hostname`]: hostname,
        [`${prefix}subdomain`]: subdomain,
      } = this;
      return {
        dt_assoc: {
          item: [
            ...utils.addItem("subdomain", subdomain),
            ...utils.addItem("hostname", hostname),
            ...utils.addItem("priority", priority),
          ],
        },
      };
    },
    txtRecordPropsMapper(prefix) {
      const {
        [`${prefix}subdomain`]: subdomain,
        [`${prefix}text`]: text,
      } = this;
      return {
        dt_assoc: {
          item: [
            ...utils.addItem("subdomain", subdomain),
            ...utils.addItem("text", text),
          ],
        },
      };
    },
    getJsonBody() {
      const {
        domain,
        nameserversOk,
        numberOfARecords,
        numberOfAAAARecords,
        numberOfCNAMERecords,
        numberOfMXRecords,
        numberOfTXTRecords,
        aRecordPropsMapper,
        aaaaRecordPropsMapper,
        cnameRecordPropsMapper,
        mxRecordPropsMapper,
        txtRecordPropsMapper,
      } = this;

      const aRecords = utils.getFieldsProps({
        numberOfFields: numberOfARecords,
        fieldName: "a",
        propsMapper: aRecordPropsMapper,
      });

      const aaaaRecords = utils.getFieldsProps({
        numberOfFields: numberOfAAAARecords,
        fieldName: "aaaa",
        propsMapper: aaaaRecordPropsMapper,
      });

      const cnameRecords = utils.getFieldsProps({
        numberOfFields: numberOfCNAMERecords,
        fieldName: "cname",
        propsMapper: cnameRecordPropsMapper,
      });

      const mxRecords = utils.getFieldsProps({
        numberOfFields: numberOfMXRecords,
        fieldName: "mx",
        propsMapper: mxRecordPropsMapper,
      });

      const txtRecords = utils.getFieldsProps({
        numberOfFields: numberOfTXTRecords,
        fieldName: "txt",
        propsMapper: txtRecordPropsMapper,
      });

      const records = [
        ...aRecords,
        ...aaaaRecords,
        ...cnameRecords,
        ...mxRecords,
        ...txtRecords,
      ];

      return {
        data_block: {
          dt_assoc: {
            item: [
              ...utils.addItem("protocol", constants.PROTOCOL.XCP),
              ...utils.addItem("object", constants.OBJECT_TYPE.DOMAIN),
              ...utils.addItem("action", constants.ACTION_TYPE.SET_DNS_ZONE),
              {
                "@_key": "attributes",
                "dt_assoc": {
                  item: [
                    ...utils.addItem("domain", domain),
                    ...(records.length
                      ? [
                        ...utils.addItem("nameservers_ok", nameserversOk),
                        {
                          "@_key": "records",
                          "dt_assoc": {
                            item: [
                              ...utils.addDnsRecord("A", aRecords),
                              ...utils.addDnsRecord("AAAA", aaaaRecords),
                              ...utils.addDnsRecord("CNAME", cnameRecords),
                              ...utils.addDnsRecord("MX", mxRecords),
                              ...utils.addDnsRecord("TXT", txtRecords),
                            ],
                          },
                        },
                      ]
                      : []
                    ),
                  ],
                },
              },
            ],
          },
        },
      };
    },
    updateDnsRecords(args) {
      return this.app.post(args);
    },
  },
  async run({ $ }) {
    const {
      updateDnsRecords,
      getJsonBody,
      jsonOutput,
    } = this;

    const response = await updateDnsRecords({
      $,
      jsonBody: getJsonBody(),
      jsonOutput,
    });

    $.export("$summary", "Successfully updated DNS records.");
    return response;
  },
};
