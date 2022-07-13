import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "github-new-card-in-column",
  name: "New Card in Column (Instant)",
  description: "Emit new event when a project card is created or moved to a specific column",
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    project: {
      propDefinition: [
        common.props.github,
        "project",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
    },
    column: {
      propDefinition: [
        common.props.github,
        "column",
        (c) => ({
          project: c.project,
        }),
      ],
      withLabel: true,
    },
  },
  methods: {
    ...common.methods,
    getWebhookEvents() {
      return [
        "project_card",
      ];
    },
    getThisColumnLabel() {
      if (typeof this.column ===  "object") {
        return this.column.label;
      }
      return this.column;
    },
    getThisColumnValue() {
      if (typeof this.column ===  "object") {
        return this.column.value;
      }
      return this.column;
    },
    isCardInThisColumn(card) {
      const { column_id: columnId } = card;
      return columnId === this.getThisColumnValue();
    },
    generateMeta(card) {
      return {
        id: card.id,
        summary: `New card in ${this.getThisColumnLabel()}: ${card.note}`,
        ts: Date.parse(card.updated_at),
      };
    },
  },
  async run(event) {
    const card = event.body.project_card;

    if (!this.isCardInThisColumn(card)) {
      console.log(`Card not in ${this.getThisColumnLabel()}. Skipping...`);
      return;
    }

    const meta = this.generateMeta(card);
    const issue = await this.github.getIssueFromProjectCard({
      repoFullName: this.repoFullname,
      cardId: card.id,
    });

    this.$emit({
      card,
      issue,
    }, meta);
  },
};
