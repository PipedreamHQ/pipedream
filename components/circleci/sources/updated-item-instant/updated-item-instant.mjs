import circleci from "../../circleci.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "circleci-updated-item-instant",
  name: "Updated Item",
  description: "Emit new event when an existing item is updated. [See the documentation]().",
  version: "0.0.{{{{ts}}}}",
  type: "source",
  dedupe: "unique",
  props: {
    circleci: {
      type: "app",
      app: "circleci",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    updatedItemFields: {
      propDefinition: [
        "circleci",
        "updatedItemFields",
      ],
      optional: true,
    },
    updatedItemType: {
      propDefinition: [
        "circleci",
        "updatedItemType",
      ],
      optional: true,
    },
  },
  hooks: {
    async activate() {
      // Generate a signing secret
      const signingSecret = crypto.randomBytes(32).toString("hex");

      // Get the Pipedream HTTP endpoint URL
      const url = this.http.endpoint;

      try {
        // Create an outbound webhook in CircleCI
        const webhook = await this.circleci._makeRequest({
          method: "POST",
          path: "/outbound_webhooks",
          data: {
            name: "Pipedream Updated Item Webhook",
            events: [
              "item-updated",
            ],
            url: url,
            verify_tls: true,
            signing_secret: signingSecret,
            scope: {}, // Adjust scope as needed
          },
        });

        // Save the webhook ID and signing secret to the database
        await this.db.set("webhookId", webhook.id);
        await this.db.set("signingSecret", signingSecret);
      } catch (error) {
        console.error("Error creating webhook:", error);
        throw new Error("Failed to create CircleCI webhook.");
      }
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");

      if (webhookId) {
        try {
          // Delete the outbound webhook in CircleCI
          await this.circleci._makeRequest({
            method: "DELETE",
            path: `/outbound_webhooks/${webhookId}`,
          });

          // Remove webhook details from the database
          await this.db.delete("webhookId");
          await this.db.delete("signingSecret");
        } catch (error) {
          console.error("Error deleting webhook:", error);
          throw new Error("Failed to delete CircleCI webhook.");
        }
      }
    },
    async deploy() {
      try {
        // Fetch the last 50 updated items from CircleCI
        const items = await this.circleci._makeRequest({
          method: "GET",
          path: "/items?updated=true&limit=50",
        });

        // Emit each item event from oldest to newest
        for (const item of items.reverse()) {
          this.$emit(item, {
            id: item.id || `${item.id}-${Date.now()}`,
            summary: `Item updated: ${item.title}`,
            ts: Date.parse(item.updated_at) || Date.now(),
          });
        }
      } catch (error) {
        console.error("Error fetching updated items:", error);
        throw new Error("Failed to fetch updated items from CircleCI.");
      }
    },
  },
  async run(event) {
    const signature = event.headers["x-signature"] || event.headers["X-Signature"];
    const signingSecret = await this.db.get("signingSecret");

    if (!signature || !signingSecret) {
      await this.http.respond({
        status: 400,
        body: "Missing signature or signing secret.",
      });
      return;
    }

    // Compute the HMAC SHA256 signature
    const computedSignature = crypto
      .createHmac("sha256", signingSecret)
      .update(event.body)
      .digest("hex");

    // Compare the computed signature with the received signature
    if (computedSignature !== signature) {
      await this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    let data;
    try {
      data = JSON.parse(event.body);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      await this.http.respond({
        status: 400,
        body: "Invalid JSON format.",
      });
      return;
    }

    // Verify that the event is an item update
    if (data.event !== "item-updated") {
      await this.http.respond({
        status: 200,
        body: "Event not relevant.",
      });
      return;
    }

    // Apply optional filters for updated fields
    if (this.updatedItemFields) {
      let updatedFields;
      try {
        updatedFields = JSON.parse(this.updatedItemFields);
      } catch (error) {
        console.error("Error parsing updatedItemFields:", error);
        await this.http.respond({
          status: 400,
          body: "Invalid updatedItemFields format.",
        });
        return;
      }

      const intersection = updatedFields.filter((field) => data.updated_fields.includes(field));
      if (intersection.length === 0) {
        await this.http.respond({
          status: 200,
          body: "No matching updated fields.",
        });
        return;
      }
    }

    // Apply optional filter for item type
    if (this.updatedItemType && data.item_type !== this.updatedItemType) {
      await this.http.respond({
        status: 200,
        body: "Item type does not match filter.",
      });
      return;
    }

    // Emit the event
    this.$emit(data, {
      id: data.item_id || `${data.item_id}-${Date.now()}`,
      summary: `Item updated: ${data.title}`,
      ts: Date.parse(data.updated_at) || Date.now(),
    });

    // Respond to acknowledge receipt
    await this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
