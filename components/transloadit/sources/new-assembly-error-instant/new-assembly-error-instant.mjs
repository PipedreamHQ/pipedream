import transloadit from "../../transloadit.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "transloadit-new-assembly-error-instant",
  name: "New Assembly Error",
  description: "Emit new event when an error occurs during assembly processing. Requires webhook support to be enabled through assembly options in Transloadit. [See the documentation](https://transloadit.com/docs/api/)",
  version: "0.0.{{ts}}",
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
    templateId: {
      propDefinition: [
        transloadit,
        "templateId",
      ],
    },
    notifyUrl: {
      propDefinition: [
        transloadit,
        "notifyUrl",
      ],
    },
    steps: {
      propDefinition: [
        transloadit,
        "steps",
      ],
    },
  },
  methods: {
    _generateSignature(secretKey, rawBody) {
      return crypto.createHmac("sha256", secretKey).update(rawBody)
        .digest("hex");
    },
  },
  hooks: {
    async deploy() {
      const assemblies = await this.transloadit._makeRequest({
        path: "/assemblies",
        params: {
          limit: 50,
          sort: "desc",
        },
      });
      for (const assembly of assemblies.items) {
        if (assembly.error) {
          this.$emit(assembly, {
            id: assembly.id,
            summary: `Assembly Error: ${assembly.id}`,
            ts: new Date(assembly.created).getTime(),
          });
        }
      }
    },
    async activate() {
      const response = await this.transloadit.createAssembly({
        templateId: this.templateId,
        steps: this.steps,
        notifyUrl: this.notifyUrl,
      });
      this.db.set("assemblyId", response.assembly_id);
    },
    async deactivate() {
      const assemblyId = this.db.get("assemblyId");
      if (assemblyId) {
        await this.transloadit.cancelAssembly({
          assemblyId,
        });
      }
    },
  },
  async run(event) {
    const rawBody = event.body_raw;
    const providedSignature = event.headers["transloadit-signature"];
    const computedSignature = this._generateSignature(this.transloadit.$auth.secret, rawBody);

    if (computedSignature !== providedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    if (event.body.ok === "ASSEMBLY_ERROR") {
      this.$emit(event.body, {
        id: event.body.assembly_id,
        summary: `Assembly error: ${event.body.error}`,
        ts: new Date(event.body.assembly_creation_date).getTime(),
      });
    }

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
