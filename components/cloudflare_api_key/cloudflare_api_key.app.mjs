import Cloudflare from "cloudflare";
import { ConfigurationError } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "cloudflare_api_key",
  propDefinitions: {
    accountIdentifier: {
      type: "string",
      label: "Account ID",
      description: "Account which the zone is created in",
      async options({ page }) {
        const response = await this.getAccounts({
          page: page + 1,
        });

        return response.result.map(({
          id: value,
          name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    zoneIdentifier: {
      type: "string",
      label: "Zone ID",
      description: "The zone identifier",
      async options({
        page,
        accountIdentifier,
      }) {
        const response = await this.getZones({
          page: page + 1,
          ["account.id"]: accountIdentifier,
        });
        console.log("response!!!", JSON.stringify(response, null, 2));

        return response.result.map(({
          id: value,
          name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    dnsRecordIdentifier: {
      type: "string",
      label: "DNS record ID",
      description: "The DNS record identifier",
      async options({
        page, zoneIdentifier,
      }) {
        const response = await this.listDnsRecords({
          zone_id: zoneIdentifier,
          page: page + 1,
        });

        return response.result.map(({
          id: value,
          name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    certificateIdentifier: {
      type: "string",
      label: "Certificate ID",
      description: "The certificate identifier",
      async options({
        page, zoneIdentifier,
      }) {
        const response = await this.getCertificates({
          zone_id: zoneIdentifier,
          page: page + 1,
        });

        return response.result.map(({ id }) => id);
      },
    },
    namespace: {
      type: "string",
      label: "Namespace",
      description: "The namespace identifier",
      async options({ accountIdentifier }) {
        const namespaces = await this.listNamespaces({
          account_id: accountIdentifier,
        });
        return namespaces.result.map((namespace) => ({
          label: namespace.title,
          value: namespace.id,
        }));
      },
    },
    dnsRecordType: {
      type: "string",
      label: "Type",
      description: "DNS record type",
      options: constants.DNS_RECORD_TYPE_OPTIONS,
    },
    dnsName: {
      type: "string",
      label: "Name",
      description: "DNS record name",
    },
    dnsRecordContent: {
      type: "string",
      label: "Content",
      description: "DNS record content",
    },
    dnsRecordProxied: {
      type: "boolean",
      label: "Proxied",
      description: "Whether the record is receiving the performance and security benefits of Cloudflare",
    },
    dnsRecordTtl: {
      type: "integer",
      label: "TTL",
      description: "Time to live, in seconds, of the DNS record. Must be between 60 and 86400, or 1 for 'automatic'",
    },
  },
  methods: {
    _throwFormattedError(error) {
      if (!error.response) {
        throw new ConfigurationError(error);
      }
      const cloudflareResponse = error.response.body;
      this._throwApiRequestFormattedError(cloudflareResponse);
    },
    _throwApiRequestFormattedError(cloudflareResponse) {
      if (!cloudflareResponse.errors) {
        throw new ConfigurationError(cloudflareResponse);
      }
      const cloudflareError = cloudflareResponse.errors[0];
      const errorMessage = cloudflareResponse.errors[0].message;
      if (cloudflareError.error_chain && cloudflareError.error_chain.length > 0) {
        throw new ConfigurationError(cloudflareError.error_chain[0].message);
      }
      throw new ConfigurationError(errorMessage);
    },
    getClient() {
      const {
        Email: apiEmail,
        API_Key: apiKey,
      } = this.$auth;

      const client = new Cloudflare({
        apiEmail,
        apiKey,
      });
      return client;
    },
    async getZones(args = {}) {
      const client = this.getClient();
      try {
        return await client.zones.list(args);
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async createZone(args = {}) {
      const client = this.getClient();
      try {
        return await client.zones.create(args);
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async changeZoneSslSetting(args = {}) {
      const client = this.getClient();
      try {
        return await client.ssl.universal.settings.edit(args);
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async editZoneSetting({
      settingId, ...args
    } = {}) {
      const client = this.getClient();
      try {
        return await client.zones.settings.edit(settingId, args);
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async createDnsRecord(args = {}) {
      const client = this.getClient();
      try {
        return await client.dns.records.create(args);
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async listDnsRecords(args = {}) {
      const client = this.getClient();
      try {
        return await client.dns.records.list(args);
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async patchDnsRecord({
      dnsRecordId, ...args
    } = {}) {
      const client = this.getClient();
      try {
        return await client.dns.records.edit(dnsRecordId, args);
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async deleteDnsRecord({
      dnsRecordId, ...args
    } = {}) {
      const client = this.getClient();
      try {
        return await client.dns.records.delete(dnsRecordId, args);
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async exportDnsRecords(args = {}) {
      const client = this.getClient();
      try {
        return await client.dns.records.export(args);
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async importDnsRecords(args = {}) {
      const client = this.getClient();
      try {
        return await client.dns.records.import(args);
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async createCertificate(args = {}) {
      const client = this.getClient();
      try {
        return await client.originCACertificates.create(args);
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async getCertificates(args = {}) {
      const client = this.getClient();
      try {
        return await client.originCACertificates.list(args);
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async revokeCertificate(certificateId) {
      const client = this.getClient();
      try {
        return await client.originCACertificates.delete(certificateId);
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async getAccounts(args = {}) {
      const client = this.getClient();
      try {
        return await client.accounts.list(args);
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async listNamespaces(args = {}) {
      const client = this.getClient();
      try {
        return await client.kv.namespaces.list(args);
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async createKeyValuePair({
      namespaceId, ...args
    } = {}) {
      const client = this.getClient();
      try {
        return await client.kv.namespaces.bulkUpdate(namespaceId, args);
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async createNamespace(args = {}) {
      const client = this.getClient();
      try {
        return await client.kv.namespaces.create(args);
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async createIpAccessRule(args = {}) {
      const client = this.getClient();
      try {
        return await client.firewall.accessRules.create(args);
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async purgeCache(args = {}) {
      const client = this.getClient();
      try {
        return await client.cache.purge(args);
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
  },
};
