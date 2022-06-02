import { axios } from "@pipedream/platform";
import cloudflare from "cloudflare";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "cloudflare_api_key",
  propDefinitions: {
    accountIdentifier: {
      type: "string",
      label: "Account ID",
      description: "Account of which the zone is created in",
      async options({ prevContext }) {
        const page = prevContext.page || 1;
        const accounts = await this.getAccounts({
          page,
        });

        return {
          options: accounts.result.map((account) => ({
            value: account.id,
            label: account.name,
          })),
          context: {
            page: page + 1,
          },
        };
      },
    },
    zoneIdentifier: {
      type: "string",
      label: "Zone ID",
      description: "The zone identifier",
      async options({ prevContext }) {
        const page = prevContext.page || 1;
        const zones = await this.getZones({
          page,
        });

        return {
          options: zones.result.map((zone) => ({
            value: zone.id,
            label: zone.name,
          })),
          context: {
            page: page + 1,
          },
        };
      },
    },
    dnsRecordIdentifier: {
      type: "string",
      label: "DNS record ID",
      description: "The DNS record identifier",
      async options({
        prevContext,
        zoneIdentifier,
      }) {
        const page = prevContext.page || 1;
        const dnsRecords = await this.listDnsRecords(zoneIdentifier, {
          page,
        });

        return {
          options: dnsRecords.result.map((record) => ({
            value: record.id,
            label: record.name,
          })),
          context: {
            page: page + 1,
          },
        };
      },
    },
    certificateIdentifier: {
      type: "string",
      label: "Certificate ID",
      description: "The certificate identifier",
      async options({
        prevContext,
        zoneIdentifier,
      }) {
        const page = prevContext.page || 1;
        const certificates = await this.getCertificates(zoneIdentifier, {
          page,
        });

        return {
          options: certificates.result.map((certificate) => certificate.id),
          context: {
            page: page + 1,
          },
        };
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
    _makeRequest($ = this, opts) {
      const {
        method = "get",
        path,
        data,
        params,
      } = opts;
      return axios($, {
        method,
        url: `https://api.cloudflare.com/client/v4${path}`,
        data,
        params,
        headers: {
          ...this._getHeaders(),
          ...opts.headers,
        },
      });
    },
    _throwFormattedError(error) {
      if (!error.response) {
        throw new Error(error);
      }
      const cloudflareResponse = error.response.body;
      this._throwApiRequestFormattedError(cloudflareResponse);
    },
    _throwApiRequestFormattedError(cloudflareResponse) {
      if (!cloudflareResponse.errors) {
        throw new Error(cloudflareResponse);
      }
      const cloudflareError = cloudflareResponse.errors[0];
      const errorMessage = cloudflareResponse.errors[0].message;
      if (cloudflareError.error_chain && cloudflareError.error_chain.length > 0) {
        throw new Error(cloudflareError.error_chain[0].message);
      }
      throw new Error(errorMessage);
    },
    _getHeaders() {
      return {
        "X-Auth-Email": `${this.$auth.Email}`,
        "X-Auth-Key": `${this.$auth.API_Key}`,
        "Content-Type": "application/json",
      };
    },
    _getCloudflareClient() {
      const client = cloudflare({
        email: this.$auth.Email,
        key: this.$auth.API_Key,
      });
      return client;
    },
    async getZones(options) {
      const cf = this._getCloudflareClient();
      try {
        const response = await cf.zones.browse(options);
        return response;
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async createZone(zoneData) {
      const cf = this._getCloudflareClient();
      try {
        const response = await cf.zones.add(zoneData);
        return response;
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async changeZoneSslSetting(zoneID, sslSetting) {
      const cf = this._getCloudflareClient();
      try {
        const response = await cf.zoneSettings.edit(zoneID, "ssl", {
          value: sslSetting,
        });
        return response;
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async updateZoneSecurityLevel(zoneID, securityLevel) {
      const cf = this._getCloudflareClient();
      try {
        const response = await cf.zoneSettings.edit(zoneID, "security_level", {
          value: securityLevel,
        });
        return response;
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async changeDevelopmentMode(zoneID, developmentMode) {
      const cf = this._getCloudflareClient();
      try {
        const response = await cf.zoneSettings.edit(zoneID, "development_mode", {
          value: developmentMode,
        });
        return response;
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async createDnsRecord(zoneID, dnsRecordData) {
      const cf = this._getCloudflareClient();
      try {
        const response = await cf.dnsRecords.add(zoneID, dnsRecordData);
        return response;
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async listDnsRecords(zoneID, dnsRecordData) {
      const cf = this._getCloudflareClient();
      try {
        const response = await cf.dnsRecords.browse(zoneID, dnsRecordData);
        return response;
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async patchDnsRecord(zoneID, dnsRecordID, dnsRecordData) {
      try {
        const response = await this._makeRequest(this, {
          method: "PATCH",
          path: `/zones/${zoneID}/dns_records/${dnsRecordID}`,
          data: dnsRecordData,
        });
        return response;
      } catch (error) {
        this._throwApiRequestFormattedError(error);
      }
    },
    async deleteDnsRecord(zoneID, dnsRecordID) {
      const cf = this._getCloudflareClient();
      try {
        const response = await cf.dnsRecords.del(zoneID, dnsRecordID);
        return response;
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async exportDnsRecords(zoneID) {
      const cf = this._getCloudflareClient();
      try {
        const response = await cf.dnsRecords.export(zoneID);
        return response;
      } catch (error) {
        this._throwFormattedError(error);
      }
    },
    async importDnsRecords(zoneID, importData) {
      try {
        const response = await this._makeRequest(this, {
          method: "POST",
          path: `/zones/${zoneID}/dns_records/import`,
          headers: {
            "Content-Type": `multipart/form-data; boundary=${importData._boundary}`,
          },
          data: importData,
        });
        return response;
      } catch (error) {
        this._throwApiRequestFormattedError(error);
      }
    },
    async createCertificate(certificateData) {
      try {
        const response = await this._makeRequest(this, {
          method: "POST",
          path: "/certificates",
          data: certificateData,
        });
        return response;
      } catch (error) {
        this._throwApiRequestFormattedError(error);
      }
    },
    async getCertificates(zoneID, params) {
      try {
        const response = await this._makeRequest(this, {
          method: "GET",
          path: "/certificates",
          params: {
            zone_id: zoneID,
            ...params,
          },
        });
        return response;
      } catch (error) {
        this._throwApiRequestFormattedError(error);
      }
    },
    async revokeCertificate(certificateID) {
      try {
        const response = await this._makeRequest(this, {
          method: "DELETE",
          path: `/certificates/${certificateID}`,
        });
        return response;
      } catch (error) {
        this._throwApiRequestFormattedError(error);
      }
    },
    async getAccounts(params) {
      try {
        const response = await this._makeRequest(this, {
          method: "GET",
          path: "/accounts/",
          params,
        });
        return response;
      } catch (error) {
        this._throwApiRequestFormattedError(error);
      }
    },
  },
};
