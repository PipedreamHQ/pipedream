import { axios } from "@pipedream/platform";
import alttextify from "../../alttextify.app.mjs";

export default {
  key: "alttextify-new-alttext-generated",
  name: "New Alt Text Generated",
  description: "Emits an event when new alt text is generated for an image. [See the documentation](https://apidoc.alttextify.net/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    alttextify,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 3600, // Poll every hour
      },
    },
    imageSubmissionId: {
      propDefinition: [
        alttextify,
        "imageSubmissionId",
      ],
      optional: true,
    },
    imageType: {
      propDefinition: [
        alttextify,
        "imageType",
      ],
      optional: true,
    },
  },
  methods: {
    _getLastProcessedDate() {
      return this.db.get("lastProcessedDate") || new Date(0).toISOString();
    },
    _setLastProcessedDate(date) {
      this.db.set("lastProcessedDate", date);
    },
    async _getNewAltTexts() {
      const lastProcessedDate = this._getLastProcessedDate();
      const opts = {
        params: {
          after: lastProcessedDate,
        },
      };
      if (this.imageSubmissionId) {
        opts.params.imageSubmissionId = this.imageSubmissionId;
      }
      const altTexts = await this.alttextify.paginate(
        (opts) => this.alttextify.retrieveAltTextByJobId(opts),
        opts,
      );
      return altTexts;
    },
  },
  hooks: {
    async deploy() {
      const altTexts = await this._getNewAltTexts();
      altTexts.slice(0, 50).forEach((altText) => {
        this.$emit(altText, {
          id: altText.asset_id,
          summary: `New alt text generated for asset ${altText.asset_id}`,
          ts: new Date(altText.created_at).getTime(),
        });
      });
      if (altTexts.length) {
        const lastProcessedAltText = altTexts[0];
        this._setLastProcessedDate(lastProcessedAltText.created_at);
      }
    },
  },
  async run() {
    const altTexts = await this._getNewAltTexts();
    altTexts.forEach((altText) => {
      this.$emit(altText, {
        id: altText.asset_id,
        summary: `New alt text generated for asset ${altText.asset_id}`,
        ts: new Date(altText.created_at).getTime(),
      });
    });
    if (altTexts.length) {
      const lastProcessedAltText = altTexts[0];
      this._setLastProcessedDate(lastProcessedAltText.created_at);
    }
  },
};
