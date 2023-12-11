import { axios } from "@pipedream/platform";
import gravityForms from "../../gravity_forms.app.mjs";

export default {
  key: "gravity_forms-form-submitted",
  name: "New Form Submission",
  description: "Emits a new event when a new form submission is received. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    gravityForms,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60, // 1 minute intervals
      },
    },
    formId: {
      propDefinition: [
        gravityForms,
        "formId",
      ],
    },
  },
  methods: {
    _getAfter() {
      return this.db.get("after") ?? null;
    },
    _setAfter(after) {
      this.db.set("after", after);
    },
  },
  hooks: {
    async deploy() {
      // Fetch the last 50 form submissions
      let after = this._getAfter();
      let entries = [];
      do {
        const response = await this.gravityForms.getForms({
          page: after
            ? after.page + 1
            : 0,
        });
        entries = response.entries;
        if (entries.length > 0) {
          // Set the after cursor for the next poll
          after = {
            page: response.paging.current_page,
          };
          this._setAfter(after);
        }
      } while (entries.length === 50);

      // Emit the last 50 form submissions
      entries.slice(-50).forEach((entry) => {
        this.$emit(entry, {
          id: entry.id,
          summary: `New Form Submission: ${entry.id}`,
          ts: Date.parse(entry.date_created),
        });
      });
    },
  },
  async run() {
    // Fetch new form submissions since the last poll
    let after = this._getAfter();
    let entries = [];
    do {
      const response = await this.gravityForms.getForms({
        page: after
          ? after.page + 1
          : 0,
      });
      entries = response.entries;
      if (entries.length > 0) {
        // Set the after cursor for the next poll
        after = {
          page: response.paging.current_page,
        };
        this._setAfter(after);
      }
    } while (entries.length === 50);

    // Emit new form submissions
    entries.forEach((entry) => {
      this.$emit(entry, {
        id: entry.id,
        summary: `New Form Submission: ${entry.id}`,
        ts: Date.parse(entry.date_created),
      });
    });
  },
};
