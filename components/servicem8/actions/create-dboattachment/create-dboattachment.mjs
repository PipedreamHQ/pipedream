import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-create-dboattachment",
  name: "Create Attachment",
  description: "Create an attachment. [See the documentation](https://developer.servicem8.com/reference/createattachments)",
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
      description:
        "Object type this attachment belongs to ([API](https://developer.servicem8.com/reference/createattachments)); lowercase. Pick a type, then choose the record below.",
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
      description:
        "Record this file is attached to (choose Related object first, then search).",
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
    attachmentName: {
      type: "string",
      label: "Attachment Name",
      optional: true,
      description: "Display name (max 127 characters)",
    },
    fileType: {
      type: "string",
      label: "File Type",
      optional: true,
      description: "File or MIME hint (max 50 characters)",
    },
    attachmentSource: {
      type: "string",
      label: "Attachment Source",
      optional: true,
      description: "Source or kind, e.g. `INVOICE`, `QUOTE` (filtering / display)",
    },
    tags: {
      type: "string",
      label: "Tags",
      optional: true,
      description: "Comma-separated tags for categorization and filtering",
    },
  },
  async run({ $ }) {
    const {
      body, recordUuid,
    } = await this.servicem8.createDboattachment({
      $,
      data: {
        related_object: this.relatedObject,
        related_object_uuid: this.relatedObjectUuid,
        attachment_name: this.attachmentName,
        file_type: this.fileType,
        attachment_source: this.attachmentSource,
        tags: this.tags,
      },
    });
    $.export("$summary", `Created Attachment${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
