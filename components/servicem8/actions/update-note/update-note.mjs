import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-update-note",
  name: "Update Note",
  description: "Update a note (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updatenotes)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8,
    uuid: {
      type: "string",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "note",
          prevContext,
          query,
        });
      },
      label: "Note to update",
      description: "Note record to load, merge, and save (search or paste UUID).",
    },
    relatedObject: {
      type: "string",
      label: "Related Object",
      optional: true,
      description:
        "Object type this note is attached to; lowercase per API. Pick a type, then choose the record below.",
      options: [
        {
          label: "Job",
          value: "job",
        },
        {
          label: "Company",
          value: "company",
        },
        {
          label: "Staff",
          value: "staff",
        },
        {
          label: "Company contact",
          value: "companycontact",
        },
        {
          label: "Job contact",
          value: "jobcontact",
        },
        {
          label: "Job activity",
          value: "jobactivity",
        },
        {
          label: "Job material",
          value: "jobmaterial",
        },
        {
          label: "Job payment",
          value: "jobpayment",
        },
        {
          label: "Queue",
          value: "queue",
        },
        {
          label: "Category",
          value: "category",
        },
        {
          label: "Badge",
          value: "badge",
        },
        {
          label: "Feedback",
          value: "feedback",
        },
        {
          label: "Note",
          value: "note",
        },
        {
          label: "Attachment",
          value: "dboattachment",
        },
      ],
    },
    relatedObjectUuid: {
      type: "string",
      label: "Related record",
      optional: true,
      description:
        "Related record UUID (choose Related object first, then search).",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        const key = (this.relatedObject || "").trim().toLowerCase();
        const resource = {
          job: "job",
          company: "company",
          staff: "staff",
          companycontact: "companycontact",
          jobcontact: "jobcontact",
          jobactivity: "jobactivity",
          jobmaterial: "jobmaterial",
          jobpayment: "jobpayment",
          queue: "queue",
          category: "category",
          badge: "badge",
          feedback: "feedback",
          note: "note",
          dboattachment: "dboattachment",
        }[key];
        if (!resource) {
          return {
            options: [],
          };
        }
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource,
          prevContext,
          query,
        });
      },
    },
    note: {
      type: "string",
      label: "Note",
      optional: true,
      description: "Note text and content.",
    },
    actionRequired: {
      type: "string",
      label: "Action Required",
      optional: true,
      description: "Follow-up text when the note requires an action from someone.",
    },
    actionCompletedByStaffUuid: {
      type: "string",
      label: "Action completed by",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "staff",
          prevContext,
          query,
        });
      },
      optional: true,
      description: "Staff member who completed the required action.",
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.updateNote({
      $,
      uuid: this.uuid,
      data: {
        related_object: this.relatedObject,
        related_object_uuid: this.relatedObjectUuid,
        note: this.note,
        action_required: this.actionRequired,
        action_completed_by_staff_uuid: this.actionCompletedByStaffUuid,
      },
    });
    $.export("$summary", `Updated Note ${this.uuid}`);
    return response;
  },
};
