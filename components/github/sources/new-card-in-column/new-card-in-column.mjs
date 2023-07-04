import common from "../common/common-webhook.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "github-new-card-in-column",
  name: "New Card in Column (Classic Projects)",
  description: "Emit new event when a (classic) project card is created or moved to a specific column. For Projects V2 use `New Issue with Status` trigger. [More information here](https://docs.github.com/en/issues/organizing-your-work-with-project-boards/tracking-work-with-project-boards/adding-issues-and-pull-requests-to-a-project-board)",
  version: "0.1.9",
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
    async loadHistoricalEvents() {
      const cards = await this.github.getProjectCards({
        columnId: this.getThisColumnValue(),
        per_page: constants.HISTORICAL_EVENTS,
      });
      for (const card of cards) {
        await this.processCard(card);
      }
    },
    async processCard(card) {
      const meta = this.generateMeta(card);
      const issue = await this.github.getIssueFromProjectCard({
        repoFullname: this.repoFullname,
        cardId: card.id,
      });
      this.$emit({
        card,
        issue,
      }, meta);
    },
  },
  async run(event) {
    const card = event.body.project_card;
    if (!card) {
      console.log("No card in event. Skipping event.");
      return;
    }

    if (!this.isCardInThisColumn(card)) {
      console.log(`Card not in ${this.getThisColumnLabel()}. Skipping...`);
      return;
    }

    this.processCard(card);
  },
};
