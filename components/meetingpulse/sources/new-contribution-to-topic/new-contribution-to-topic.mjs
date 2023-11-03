import common from "../common.mjs";

export default {
  ...common,
  key: "meetingpulse-new-contribution-to-topic",
  name: "New Contribution to Topic",
  description:
    "Emit new event every time there is new data for all created topics for a meeting. [See the documentation](https://app.meet.ps/api/docs/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getAndProcessData(emit = false) {
      const topics = await this.meetingpulse.getTopics({
        meetingId: this.meetingId,
      });
      const savedIdeas = this._getSavedValue();

      for (const topic of Object.values(topics)) {
        const ideas = Object.values(topic.ideas)?.filter?.(
          ({ id }) => !savedIdeas.includes(id),
        );
        if (ideas?.length) {
          if (emit) {
            const ts = Date.now();
            this.$emit(topic, {
              id: topic.id + ts.toString(),
              summary: `${ideas.length} new idea${ideas.length === 1
                ? ""
                : "s"} in topic: ${
                topic.OCC ?? topic.callout ?? topic.text
              }`,
              ts,
            });
          }
          savedIdeas.push(...ideas.map(({ id }) => id));
        }
      }

      this._setSavedValue(savedIdeas);
    },
  },
};
