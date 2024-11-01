import gocanvas from "../../gocanvas.app.mjs";

export default {
  key: "gocanvas-new-submission-instant",
  name: "New Submission Instant",
  description: "Emit new event when a new submission is uploaded to the specified GoCanvas application.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    gocanvas,
    db: "$.service.db",
    applicationId: {
      propDefinition: [
        gocanvas,
        "applicationId",
      ],
    },
    submissionId: {
      propDefinition: [
        gocanvas,
        "submissionId",
        (c) => ({
          applicationId: c.applicationId,
        }),
      ],
      optional: true,
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, created_at,
      } = data;
      return {
        id,
        summary: `New Submission: ${id}`,
        ts: Date.parse(created_at),
      };
    },
  },
  async run(event) {
    const { body } = event;
    if (!body.submission || !body.submission.id) {
      console.log("Ignoring event without submission id");
      return;
    }
    const applicationId = this.applicationId;
    const submissionId = this.submissionId || body.submission.id;
    if (applicationId !== body.submission.application_id) {
      console.log("Ignoring submission from another application");
      return;
    }
    const data = await this.gocanvas.emitNewEvent({
      submissionId,
    });
    const meta = this.generateMeta(data);
    this.$emit(data, meta);
  },
};
