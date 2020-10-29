const axios = require("axios");

module.exports = {
  type: "app",
  app: "salesforce_rest_api",
  methods: {
    _authToken() {
      return this.$auth.oauth_access_token;
    },
    _instance() {
      return this.$auth.yourinstance;
    },
    _apiVersion() {
      return "50.0";
    },
    _baseApiUrl() {
      const instance = this._instance();
      return `https://${instance}.salesforce.com`;
    },
    _userApiUrl() {
      const baseUrl = this._baseApiUrl();
      return `${baseUrl}/services/oauth2/userinfo`;
    },
    _apexClassApiUrl(id) {
      const baseUrl = this._baseApiUrl();
      const apiVersion = this._apiVersion();
      const url = `${baseUrl}/services/data/v${apiVersion}/tooling/sobjects/ApexClass`;
      return id ? `${url}/${id}` : url;
    },
    _apexTriggerApiUrl(id) {
      const baseUrl = this._baseApiUrl();
      const apiVersion = this._apiVersion();
      const url = `${baseUrl}/services/data/v${apiVersion}/tooling/sobjects/ApexTrigger`;
      return id ? `${url}/${id}` : url;
    },
    async getApiUrls() {
      const url = this._userApiUrl();
      const requestConfig = this._makeRequestConfig();
      const { data } = await axios.get(url, requestConfig);
      return Object
        .entries(data.urls)
        .reduce((accum, [urlType, rawUrl]) => {
          const apiVersion = this._apiVersion();
          const url = rawUrl.replace("{version}", apiVersion);
          return {
            ...accum,
            [urlType]: url,
          };
        }, {});
    },
    _makeRequestConfig() {
      const authToken = this._authToken();
      const headers = {
        "Authorization": `Bearer ${authToken}`,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
      return {
        headers,
      };
    },
    _metadataMessage(body) {
      const sessionId = this._authToken();
      return `
        <env:Envelope
          xmlns:env="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        >
          <env:Header>
            <urn:SessionHeader xmlns:urn="http://soap.sforce.com/2006/04/metadata">
              <urn:sessionId>${sessionId}</urn:sessionId>
            </urn:SessionHeader>
          </env:Header>
          <env:Body>
            ${body}
          </env:Body>
        </env:Envelope>
      `;
    },
    _createRemoteSiteMessage(fullName, url) {
      const body = `
        <createMetadata xmlns="http://soap.sforce.com/2006/04/metadata">
          <metadata xsi:type="RemoteSiteSetting">
            <fullName>${fullName}</fullName>
            <isActive>true</isActive>
            <url>${url}</url>
          </metadata>
        </createMetadata>
      `;
      return this._metadataMessage(body);
    },
    _deleteRemoteSiteMessage(fullName) {
      const body = `
        <deleteMetadata xmlns="http://soap.sforce.com/2006/04/metadata">
          <metadataType>RemoteSiteSetting</metadataType>
          <fullNames>${fullName}</fullNames>
        </deleteMetadata>
      `;
      return this._metadataMessage(body);
    },
    async _postMetadataMessage(metadataApiUrl, message, soapAction) {
      const baseRequestConfig = this._makeRequestConfig();
      const headers = {
        ...baseRequestConfig.headers,
        "SOAPAction": soapAction,
        "Content-Type": "text/xml",
      };
      const responseType = "text/xml";
      const requestConfig = {
        ...baseRequestConfig,
        headers,
        responseType,
      };
      return axios.post(metadataApiUrl, message, requestConfig);
    },
    async createRemoteSite(metadataApiUrl, fullName, endpointUrl) {
      const message = this._createRemoteSiteMessage(fullName, endpointUrl);
      const soapAction = "RemoteSiteSetting";
      return this._postMetadataMessage(metadataApiUrl, message, soapAction);
    },
    async deleteRemoteSite(metadataApiUrl, fullName) {
      const message = this._deleteRemoteSiteMessage(fullName);
      const soapAction = "RemoteSiteSetting";
      return this._postMetadataMessage(metadataApiUrl, message, soapAction);
    },
    async createApexClass(name, body) {
      // API docs: https://sforce.co/3e4rgt2
      const url = this._apexClassApiUrl();
      const apiVersion = this._apiVersion();
      const requestData = {
        apiVersion,
        body,
        name,
      };
      const requestConfig = this._makeRequestConfig();
      const { data } = await axios.post(url, requestData, requestConfig);
      console.log(`Created Apex Class: ${name} (ID: ${data.id})`);

      return data;
    },
    async deleteApexClass(id) {
      // API docs: https://sforce.co/3e4rgt2
      const url = this._apexClassApiUrl(id);
      const requestConfig = this._makeRequestConfig();
      return axios.delete(url, requestConfig);
    },
    async createApexTrigger(name, body, tableEnumOrId) {
      // API docs: https://sforce.co/34zeJdV
      const url = this._apexTriggerApiUrl();
      const apiVersion = this._apiVersion();
      const requestData = {
        apiVersion,
        body,
        name,
        tableEnumOrId,
      };
      const requestConfig = this._makeRequestConfig();
      const { data } = await axios.post(url, requestData, requestConfig);
      console.log(`Created Apex Trigger: ${name} (ID: ${data.id})`);

      return data;
    },
    async deleteApexTrigger(id) {
      // API docs: https://sforce.co/34zeJdV
      const url = this._apexTriggerApiUrl(id);
      const requestConfig = this._makeRequestConfig();
      return axios.delete(url, requestConfig);
    },
  },
};
