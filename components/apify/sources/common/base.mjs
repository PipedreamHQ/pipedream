import { createHash } from "crypto";
import {
  WEBHOOK_EVENT_TYPE_GROUPS, WEBHOOK_EVENT_TYPES,
} from "@apify/consts";
import { ConfigurationError } from "@pipedream/platform";
import apify from "../../apify.app.mjs";

export default {
  props: {
    apify,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    eventTypes: {
      type: "string[]",
      label: "Trigger on run states",
      description: "Which terminal run states should fire this trigger. Leave empty to fire on all of them (the default).",
      optional: true,
      options: WEBHOOK_EVENT_TYPE_GROUPS.ACTOR_RUN_TERMINAL.map((value) => {
        const state = value.split(".").pop()
          .replaceAll("_", " ")
          .toLowerCase();
        return {
          label: state.charAt(0).toUpperCase() + state.slice(1),
          value,
        };
      }),
    },
  },
  methods: {
    // SHA-256(endpoint + condition target) - stable across re-deploys so Apify
    // reuses the same webhook instead of creating duplicates.
    getIdempotencyKey() {
      const target = Object.values(this.getCondition()).join(":");
      return createHash("sha256")
        .update(`${this.http.endpoint}:${target}`)
        .digest("hex");
    },
  },
  hooks: {
    async activate() {
      // Block empty or unset condition targets.
      if (Object.values(this.getCondition()).some((value) => !value)) {
        throw new ConfigurationError(
          this.getEmptyConditionMessage?.()
            ?? "No target selected. Select an Actor or task before deploying.",
        );
      }

      // Whitelist terminal states only; fall back to all when none are valid.
      const selected = (this.eventTypes ?? [])
        .filter((type) => WEBHOOK_EVENT_TYPE_GROUPS.ACTOR_RUN_TERMINAL.includes(type));

      const response = await this.apify.createHook({
        requestUrl: this.http.endpoint,
        eventTypes: selected.length
          ? selected
          : WEBHOOK_EVENT_TYPE_GROUPS.ACTOR_RUN_TERMINAL,
        condition: this.getCondition(),
        idempotencyKey: this.getIdempotencyKey(),
      });
      this.db.set("webhookId", response.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (!webhookId) {
        return;
      }

      try {
        await this.apify.deleteHook(webhookId);
        // Forget the webhook after it's deleted.
        this.db.set("webhookId", null);
      } catch (error) {
        // Already removed on Apify; safe to forget.
        if (error?.statusCode === 404) {
          console.warn(`Apify webhook ${webhookId} was already removed; clearing stored id.`);
          this.db.set("webhookId", null);
          return;
        }
        // On other errors, keep the id and rethrow.
        throw error;
      }
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    // Prefer the run ID; TEST dispatches carry no eventData, so guard the
    // access and fall back to a stable per-dispatch key.
    const dedupeId = body.eventData?.actorRunId
      ?? `${body.userId}-${body.createdAt}`;

    this.$emit(body, {
      summary: body.eventType === WEBHOOK_EVENT_TYPES.TEST
        ? "Webhook test has successfully triggered!"
        : this.getSummary(body),
      id: dedupeId,
      ts: Date.parse(body.createdAt),
    });
  },
};
