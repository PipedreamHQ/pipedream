import transloadit from "../../transloadit.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "transloadit-new-upload-instant",
  name: "New Upload Instant",
  description: "Emit new event when a new file is uploaded to trigger an assembly. [See the documentation](https://transloadit.com/docs/api/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    transloadit,
    http: {
      type: "$.interface.http",
      customResponse: false,
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
    files: {
      propDefinition: [
        transloadit,
        "files",
      ],
    },
    steps: {
      propDefinition: [
        transloadit,
        "steps",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // Logic for emitting historical data, if applicable
    },
    async activate() {
      // Logic to create a webhook subscription, if applicable
    },
    async deactivate() {
      // Logic to remove the webhook subscription, if applicable
    },
  },
  methods: {
    async triggerAssembly() {
      return await this.transloadit.createAssembly({
        templateId: this.templateId,
        steps: this.steps,
        files: this.files,
        notifyUrl: this.notifyUrl,
      });
    },
  },
  async run(event) {
    const { data: body } = event;
    this.$emit(body, {
      id: body.assembly_id,
      summary: `New upload: ${body.assembly_id}`,
      ts: Date.parse(body.uploaded_at) || Date.now(),
    });
  },
};
