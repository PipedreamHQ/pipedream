import renderform from "../../renderform.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "renderform-new-render-result",
  name: "New Render Result",
  description: "Emits an event when a new render result is ready in RenderForm. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    renderform,
    renderId: {
      propDefinition: [
        renderform,
        "renderId",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      // Emit the last 50 render results during deploy
      const lastResults = await this.renderform.getRenderResult({
        renderId: this.renderId,
      });
      lastResults.slice(-50).forEach((result) => {
        this.$emit(result, {
          id: result.id,
          summary: `New Render Result: ${result.id}`,
          ts: result.createdAt
            ? Date.parse(result.createdAt)
            : Date.now(),
        });
      });
    },
  },
  async run() {
    // Check for new render results since the last time this method was run
    const lastResultId = this.db.get("lastResultId") || null;
    let newLastResultId = lastResultId;
    let foundNew = false;

    const results = await this.renderform.getRenderResult({
      renderId: this.renderId,
    });
    results.forEach((result) => {
      if (result.id === lastResultId) {
        foundNew = true;
        return;
      }
      if (!foundNew) {
        return;
      }
      this.$emit(result, {
        id: result.id,
        summary: `New Render Result: ${result.id}`,
        ts: result.createdAt
          ? Date.parse(result.createdAt)
          : Date.now(),
      });
      newLastResultId = result.id;
    });

    // Update the lastResultId in the db
    this.db.set("lastResultId", newLastResultId);
  },
};
