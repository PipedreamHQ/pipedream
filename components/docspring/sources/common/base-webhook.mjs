import { ConfigurationError } from "@pipedream/platform";
import docspring from "../../docspring.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  props: {
    docspring,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    eventTypes: {
      propDefinition: [
        docspring,
        "eventTypes",
      ],
    },
    templateIds: {
      propDefinition: [
        docspring,
        "templateId",
      ],
      type: "string[]",
      label: "Templates",
      description: "Only emit events for these templates (their submissions, signature requests and template events), e.g. `[\"tpl_1234567890abcdef01\"]`."
        + " Use **Find Templates** to find them (the `id` field). Templates only filter submission, signature request and template events:"
        + " with templates set, combined PDF, submission batch, custom file and folder events can't be chosen."
        + " Leave blank for every template.",
      optional: true,
    },
    mode: {
      type: "string",
      label: "Live or Test",
      description: "Only emit events for `live` or `test` submissions, e.g. `live`. Leave blank for both.",
      options: [
        "live",
        "test",
      ],
      optional: true,
    },
    includeSubmissionData: {
      type: "boolean",
      label: "Include Submission Data",
      description: "`true` (the default) includes submissions' and signature requests' field values in `data`;"
        + " `false` sends them as null. e.g. `true`.",
      default: true,
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const eventTypes = utils.parseStringArray(this.eventTypes);
      const templateIds = utils.parseStringArray(this.templateIds);
      const unfiltered = templateIds
        ? utils.eventsTemplatesCantFilter(eventTypes)
        : [];
      if (unfiltered.length) {
        // DocSpring would reject the webhook with a 422: say which events before asking it.
        throw new ConfigurationError("Templates only filter submission, signature request and template events, so these events can't be chosen"
          + ` with them: ${unfiltered.map((eventType) => `\`${eventType}\``).join(", ")}. Remove those events, or leave Templates blank.`);
      }
      const webhook = await this.docspring.createWebhook({
        data: utils.compact({
          url: this.http.endpoint,
          name: "Pipedream",
          event_types: eventTypes,
          template_ids: templateIds,
          mode: this.mode,
          include_submission_data: utils.toBoolean(this.includeSubmissionData, "Include Submission Data") ?? true,
        }),
      });
      if (!webhook.secret) {
        // Every delivery would be turned away unsigned, so don't leave the webhook behind.
        await this.docspring.deleteWebhook({
          webhookId: webhook.id,
        });
        throw new Error("DocSpring created the webhook without a signing secret, so its deliveries can't be verified");
      }
      this._setHookId(webhook.id);
      this._setHookSecret(webhook.secret);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (!hookId) {
        return;
      }
      try {
        await this.docspring.deleteWebhook({
          webhookId: hookId,
        });
      } catch (error) {
        // A 404 means the webhook was already deleted. Any other error (e.g. a revoked
        // token) leaves it in DocSpring, so deactivation fails.
        if (error.response?.status !== 404) {
          throw error;
        }
      }
      this._setHookId(null);
      this._setHookSecret(null);
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    _getHookSecret() {
      return this.db.get("hookSecret");
    },
    _setHookSecret(secret) {
      this.db.set("hookSecret", secret || null);
    },
    /**
     * Whether a request came from DocSpring: its `X-DocSpring-Signature` matches the raw body
     * (`event.bodyRaw`) signed with the webhook's secret. Without a stored secret nothing can be
     * checked, so every request is turned away.
     * @param {object} event - the HTTP request
     * @returns {boolean}
     */
    _isFromDocSpring(event) {
      const secret = this._getHookSecret();
      if (!secret) {
        return false;
      }
      return utils.verifySignature({
        secret,
        header: utils.headerValue(event.headers, "x-docspring-signature"),
        rawBody: event.bodyRaw,
      });
    },
  },
  async run(event) {
    if (!this._isFromDocSpring(event)) {
      console.log(this._getHookSecret()
        ? "Dropped a request whose X-DocSpring-Signature doesn't match the webhook's secret"
        : "Dropped a request: the source has no webhook secret to check it with. Deactivate and reactivate the source.");
      await this.http.respond({
        status: 401,
        body: "Invalid X-DocSpring-Signature",
      });
      return;
    }
    await this.http.respond({
      status: 200,
    });
    const body = (event && event.body) || {};
    // DocSpring sends each event with a unique `id` that stays the same when a delivery is
    // retried. Requiring it keeps `dedupe: "unique"` working for retries.
    if (!body.id) {
      throw new Error("The DocSpring webhook delivery has no event `id`");
    }
    const output = utils.eventOutput(body);
    const ts = Date.parse(body.created_at);
    this.$emit(output, {
      id: body.id,
      summary: `${body.event_type || "Event"}: ${output.resource_id ?? ""}`,
      ts: Number.isNaN(ts)
        ? Date.now()
        : ts,
    });
  },
};
