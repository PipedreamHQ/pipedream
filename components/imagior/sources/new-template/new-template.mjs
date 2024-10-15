import imagior from "../../imagior.app.mjs";

export default {
  key: "imagior-new-template",
  name: "New Template Created",
  description: "Emits a new event when a new template is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    imagior,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    _getPrevTemplateId() {
      return this.db.get("prevTemplateId");
    },
    _setPrevTemplateId(id) {
      this.db.set("prevTemplateId", id);
    },
  },
  async run() {
    const { elements: templates } = await this.imagior._makeRequest({
      path: "/templates/all",
    });

    if (!templates.length) {
      console.log("No templates found");
      return;
    }

    const sortedTemplates = templates.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    const latestTemplate = sortedTemplates[0];
    const prevTemplateId = this._getPrevTemplateId();

    if (prevTemplateId && latestTemplate.id === prevTemplateId) {
      console.log("No new templates found");
      return;
    }

    this._setPrevTemplateId(latestTemplate.id);
    this.$emit(latestTemplate, {
      id: latestTemplate.id,
      summary: `New template: ${latestTemplate.name}`,
      ts: Date.parse(latestTemplate.createdAt),
    });
  },
};
