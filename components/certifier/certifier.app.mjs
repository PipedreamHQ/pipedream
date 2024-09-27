import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "certifier",
  methods: {
    getUrl(path, apiVersion = "v1") {
      return `https://api.certifier.io/${apiVersion}${path}`;
    },
    getHeaders(headers = {}) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.access_token}`,
        "Certifier-Version": "2022-10-26",
        ...headers,
      };
    },
    callApi({
      $ = this, path, headers, apiVersion, ...args
    } = {}) {
      return axios($, {
        url: this.getUrl(path, apiVersion),
        headers: this.getHeaders(headers),
        ...args,
      });
    },
    searchGroups(args = {}) {
      return this.callApi({
        path: "/groups",
        ...args,
      });
    },
    searchAttributes(args = {}) {
      return this.callApi({
        path: "/attributes",
        ...args,
      });
    },
    searchDesigns(args = {}) {
      return this.callApi({
        path: "/designs",
        ...args,
      });
    },
    createCredential(args = {}) {
      return this.callApi({
        method: "POST",
        path: "/credentials",
        ...args,
      });
    },
    issueCredential(id, args = {}) {
      return this.callApi({
        method: "POST",
        path: `/credentials/${id}/issue`,
        ...args,
      });
    },
    sendCredential(id, args = {}) {
      return this.callApi({
        method: "POST",
        path: `/credentials/${id}/send`,
        ...args,
      });
    },
    createGroup(args = {}) {
      return this.callApi({
        method: "POST",
        path: "/groups",
        ...args,
      });
    },
  },
  propDefinitions: {
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The ID of the group",
      async options({ prevContext } = {}) {
        const response = await this.searchGroups({
          params: {
            cursor: prevContext.cursor,
          },
        });
        const groups = response.data;
        const cursor = response.pagination.next;

        return {
          options: groups.map(({
            id, name,
          }) => ({
            label: name,
            value: id,
          })),
          context: {
            cursor,
          },
        };
      },
    },
    recipientName: {
      type: "string",
      label: "Recipient Name",
      description: "The name of the credential’s recipient.",
    },
    recipientEmail: {
      type: "string",
      label: "Recipient Email",
      description: "The email of the credential’s recipient.",
    },
    issueCredential: {
      type: "boolean",
      label: "Issue Credential",
      description:
        "Whether to issue a credential (`true`) or create a draft (`false`) when the workflow is triggered (default `true`).",
    },
    sendCredential: {
      type: "boolean",
      label: "Send Credential",
      description:
        "Whether to send a credential to a recipient via email (`true`) or not (`false`) when the workflow is triggered (default is `true`). This step is only applicable if \"Issue Credential\" is set to `true`.",
    },
    issueDate: {
      type: "string",
      label: "Issue Date",
      description:
        "The date (in `YYYY-MM-DD` format) of your credential's issuance (by default this field is set to the day when the workflow is triggered).",
      optional: true,
    },
    expiryDate: {
      type: "string",
      label: "Expiry Date",
      description:
        "The date (in `YYYY-MM-DD` format) of your credential's expiration. If not provided, expiry date from the group settings will be used (by default this field is empty).",
      optional: true,
    },
    groupName: {
      type: "string",
      label: "Group Name",
      description:
        "The group's name that is used as [group.name] attribute later on.",
    },
    certificateDesignId: {
      type: "string",
      label: "Certificate Design",
      description: "The unique certificate design's name.",
      optional: true,
      async options({ prevContext } = {}) {
        const response = await this.searchDesigns({
          params: {
            cursor: prevContext.cursor,
          },
        });
        const designs = response.data;
        const cursor = response.pagination.next;

        return {
          options: designs
            .filter((design) => design.type === "certificate")
            .map(({
              id, name,
            }) => ({
              label: name,
              value: id,
            })),
          context: {
            cursor,
          },
        };
      },
    },
    badgeDesignId: {
      type: "string",
      label: "Badge Design",
      description: "The unique badge design's name.",
      optional: true,
      async options({ prevContext } = {}) {
        const response = await this.searchDesigns({
          params: {
            cursor: prevContext.cursor,
          },
        });
        const designs = response.data;
        const cursor = response.pagination.next;

        return {
          options: designs
            .filter((design) => design.type === "badge")
            .map(({
              id, name,
            }) => ({
              label: name,
              value: id,
            })),
          context: {
            cursor,
          },
        };
      },
    },
    learningEventUrl: {
      type: "string",
      label: "Learning Event URL",
      description:
        "The learning event's URL that is shown in the digital wallet.",
      optional: true,
    },
    credentialId: {
      type: "string",
      label: "Credential ID",
      description:
        "The credential's unique ID.",
    },
  },
};
