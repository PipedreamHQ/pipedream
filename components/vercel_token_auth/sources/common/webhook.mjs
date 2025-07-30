import { createHmac } from "crypto";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../vercel_token_auth.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
    teamId: {
      label: "Team ID",
      description: "The Team identifier to perform the request on behalf of. Eg. `team_1a2b3c4d5e6f7g8h9i0j1k2l`",
      optional: true,
      propDefinition: [
        app,
        "team",
      ],
    },
    slug: {
      label: "Slug",
      description: "The Team slug to perform the request on behalf of. Eg. `my-team-url-slug`",
      optional: true,
      propDefinition: [
        app,
        "team",
        () => ({
          mapper: ({ slug }) => slug,
        }),
      ],
    },
    projectIds: {
      type: "string[]",
      label: "Project IDs",
      description: "The Project identifiers to perform the request on behalf of",
      optional: true,
      propDefinition: [
        app,
        "project",
      ],
    },
  },
  hooks: {
    async activate() {
      const {
        createWebhook,
        getEvents,
        http: { endpoint: url },
        setWebhookId,
        setWebhookSecret,
        teamId,
        slug,
        projectIds,
      } = this;

      const response =
        await createWebhook({
          params: {
            teamId,
            slug,
          },
          data: {
            url,
            events: getEvents(),
            projectIds,
          },
        });

      setWebhookId(response.id);
      setWebhookSecret(response.secret);
    },
    async deactivate() {
      const {
        deleteWebhook,
        getWebhookId,
      } = this;

      const webhookId = getWebhookId();
      if (webhookId) {
        await deleteWebhook({
          webhookId,
        });
      }
    },
  },
  methods: {
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    setWebhookId(value) {
      this.db.set(constants.WEBHOOK_ID, value);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    setWebhookSecret(value) {
      this.db.set(constants.WEBHOOK_SECRET, value);
    },
    getWebhookSecret() {
      return this.db.get(constants.WEBHOOK_SECRET);
    },
    getEvents() {
      throw new ConfigurationError("getEvents is not implemented");
    },
    isSignatureValid(incommingSignature, bodyRaw) {
      const secret = this.getWebhookSecret();
      const rawBodyBuffer = Buffer.from(bodyRaw, "utf-8");
      const expectedSignature =
        createHmac("sha1", secret)
          .update(rawBodyBuffer)
          .digest("hex");
      return expectedSignature === incommingSignature;
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    createWebhook(args = {}) {
      return this.app.makeRequest({
        method: "POST",
        endpoint: "v1/webhooks",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    } = {}) {
      return this.app.makeRequest({
        method: "DELETE",
        endpoint: `v1/webhooks/${webhookId}`,
        ...args,
      });
    },
  },
  async run({
    body, bodyRaw, headers,
  }) {
    const incommingSignature = headers["x-vercel-signature"];

    if (!incommingSignature) {
      throw new ConfigurationError("Missing x-vercel-signature header");
    }

    const isValid = this.isSignatureValid(incommingSignature, bodyRaw);

    if (!isValid) {
      throw new ConfigurationError("Invalid x-vercel-signature header");
    }

    this.processResource(body);
  },
};
