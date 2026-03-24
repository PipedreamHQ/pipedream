import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-create-note",
  name: "Create Note",
  description: "Create a note. [See the documentation](https://developer.servicem8.com/reference/createnotes)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8,
    relatedObject: {
      type: "string",
      label: "Related Object",
      optional: true,
      description:
        "Object type this note is attached to ([API](https://developer.servicem8.com/reference/createnotes)); lowercase. Pick a type, then choose the record below.",
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
        "Record this note is attached to (choose Related object first, then search).",
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
    createDate: {
      type: "string",
      label: "Create Date",
      optional: true,
      description: "Timestamp string as accepted by the API (reference field name `create_date`).",
    },
  },
  async run({ $ }) {
    const {
      body, recordUuid,
    } = await this.servicem8.createNote({
      $,
      data: {
        related_object: this.relatedObject,
        related_object_uuid: this.relatedObjectUuid,
        note: this.note,
        action_required: this.actionRequired,
        action_completed_by_staff_uuid: this.actionCompletedByStaffUuid,
        create_date: this.createDate,
      },
    });
    $.export("$summary", `Created Note${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
