import { axios } from "@pipedream/platform";
import kizeoForms from "../../kizeo-forms.app.mjs";

export default {
  key: "kizeo-forms-new-form",
  name: "New Form Created",
  description: "Emits an event when a new form is created on Kizeo Forms. [See the documentation](https://kizeo.github.io/kizeo-forms-documentations/docs/en/restv3)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    kizeoForms,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    optionalFormFieldIds: {
      propDefinition: [
        kizeoForms,
        "optionalFormFieldIds",
      ],
    },
  },
  methods: {
    ...kizeoForms.methods,
    _getCreatedAfter() {
      return this.db.get("createdAfter") || null;
    },
    _setCreatedAfter(createdAfter) {
      this.db.set("createdAfter", createdAfter);
    },
  },
  hooks: {
    async deploy() {
      // Fetch forms at the time of deployment to avoid duplicates
      const forms = await this.kizeoForms.retrieveUnreadFormData();
      forms.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const latestForms = forms.slice(0, 50);

      for (const form of latestForms) {
        this.$emit(form, {
          id: form.id,
          summary: `New Form: ${form.name}`,
          ts: Date.parse(form.created_at),
        });
      }

      if (latestForms.length > 0) {
        this._setCreatedAfter(latestForms[0].created_at);
      }
    },
  },
  async run() {
    const createdAfter = this._getCreatedAfter();
    let forms = await this.kizeoForms.retrieveUnreadFormData();

    if (createdAfter) {
      forms = forms.filter(
        (form) => Date.parse(form.created_at) > Date.parse(createdAfter),
      );
    }

    forms.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    for (const form of forms) {
      this.$emit(form, {
        id: form.id,
        summary: `New Form: ${form.name}`,
        ts: Date.parse(form.created_at),
      });
    }

    if (forms.length > 0) {
      this._setCreatedAfter(forms[0].created_at);
    }
  },
};
