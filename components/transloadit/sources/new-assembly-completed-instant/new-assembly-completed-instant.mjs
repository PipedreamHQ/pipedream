import transloadit from "../../transloadit.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "transloadit-new-assembly-completed-instant",
  name: "New Assembly Completed (Instant)",
  description: "Emit new event when a Transloadit assembly finishes processing. Requires the assembly template or notification URL to be configured in Transloadit to call the webhook. [See the documentation](https://transloadit.com/docs/api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    transloadit: {
      type: "app",
      app: "transloadit",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      try {
        const assemblies = await this.transloadit._makeRequest({
          method: "GET",
          path: "/assemblies",
          params: {
            auth: {
              key: this.transloadit.$auth.api_key,
            },
            sort: "created",
            order: "desc",
            limit: 50,
          },
        });
        for (const assembly of assemblies) {
          this.$emit(assembly, {
            id: assembly.id,
            summary: `New assembly completed with ID: ${assembly.id}`,
            ts: Date.parse(assembly.finished),
          });
        }
      } catch (error) {
        console.error("Error fetching assemblies:", error);
      }
    },
    async activate() {
      // Webhook setup is expected to be configured within Transloadit; no action necessary
    },
    async deactivate() {
      // Webhook cleanup is expected to be configured within Transloadit; no action necessary
    },
  },
  async run(event) {
    const {
      httpRequest, body,
    } = event;
    const computedSignature = this.transloadit.computeSignature(httpRequest.body);
    const receivedSignature = httpRequest.headers["transloadit-signature"];

    if (computedSignature !== receivedSignature) {
      await this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    await this.http.respond({
      status: 200,
      body: "OK",
    });

    if (body.ok === "ASSEMBLY_COMPLETED") {
      this.$emit(body, {
        id: body.assembly_id,
        summary: `Assembly completed with ID: ${body.assembly_id}`,
        ts: Date.now(),
      });
    }
  },
};
