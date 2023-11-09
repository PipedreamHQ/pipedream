import common from "../common.mjs";

export default {
  ...common,
  key: "openai-new-fine-tuning-job-created",
  name: "New Fine Tuning Job Created",
  description: "Emit new event when a new fine-tuning job is created in OpenAI. [See the documentation](https://platform.openai.com/docs/api-reference/fine-tuning/list)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    async getAndProcessItems() {
      const savedItems = this._getSavedItems();
      const { data } = await this.openai.listFineTuningJobs();
      data?.filter(({ id }) => !savedItems.includes(id)).forEach((job) => {
        this.$emit(job, {
          id: job.id,
          summary: `New Fine Tuning Job: ${job.id}`,
          ts: job.created_at * 1000, // Convert to milliseconds
        });
        savedItems.push(job.id);
      });
      this._setSavedItems(savedItems);
    },
  },
};
