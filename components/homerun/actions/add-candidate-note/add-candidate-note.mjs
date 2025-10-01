import app from "../../homerun.app.mjs";

export default {
  key: "homerun-add-candidate-note",
  name: "Add Candidate Note",
  description: "Adds a note to a candidate's profile in Homerun. [See the documentation](https://developers.homerun.co/#tag/Job-Application-Notes/operation/job-applications.job-application-id.notes.post).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    jobApplicationId: {
      propDefinition: [
        app,
        "jobApplicationId",
      ],
    },
    note: {
      type: "string",
      label: "Note Content",
      description: "The content of the note to add.",
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "Name of the note's author.",
    },
  },
  methods: {
    addCandidateNote({
      jobApplicationId, ...args
    } = {}) {
      return this.app.post({
        path: `/job-applications/${jobApplicationId}/notes`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      addCandidateNote,
      jobApplicationId,
      note,
      displayName,
    } = this;

    const response = await addCandidateNote({
      $,
      jobApplicationId,
      data: {
        note,
        display_name: displayName,
      },
    });

    $.export("$summary", "Successfully added a note.");
    return response;
  },
};
