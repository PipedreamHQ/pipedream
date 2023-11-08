import common from "../common.mjs";

export default {
  ...common,
  key: "meetingpulse-new-lead-generated",
  name: "New Lead Generated",
  description:
    "Emit new event for each new lead generated. [See the documentation](https://app.meet.ps/api/docs/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getAndProcessData(emit = false) {
      const leads = await this.meetingpulse.getEmailLeads({
        meetingId: this.meetingId,
      });
      const savedLeads = this._getSavedValue();

      leads
        ?.filter?.(({ id }) => !savedLeads.includes(id))
        .forEach((lead) => {
          if (emit) {
            this.$emit(lead, {
              id: lead.id,
              summary: `New Lead: ${lead.email}`,
              ts: Date.now(),
            });
          }
          savedLeads.push(lead.id);
        });

      this._setSavedValue(savedLeads);
    },
  },
};
