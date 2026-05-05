import servicem8 from "../../servicem8.app.mjs";
import { optionalBool01 } from "../../common/payload.mjs";

export default {
  key: "servicem8-update-dboattachment",
  name: "Update Attachment",
  description: "Update an attachment (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updateattachments)",
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
          resource: "dboattachment",
          prevContext,
          query,
        });
      },
      label: "Attachment to update",
      description: "Attachment to load, merge, and save (search or paste UUID).",
    },
    relatedObject: {
      type: "string",
      label: "Related Object",
      optional: true,
      description: "Object type; lowercase per API. Pick a type, then choose the record below.",
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
      description: "Related record UUID (choose Related object first, then search).",
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
      description: "Source or kind, e.g. `INVOICE`, `QUOTE`",
    },
    tags: {
      type: "string",
      label: "Tags",
      optional: true,
      description: "Comma-separated tags",
    },
    isFavourite: {
      type: "boolean",
      label: "Is Favourite",
      optional: true,
      description: "Favourite flag (`1` / `0` in the API body).",
    },
    metadata: {
      type: "string",
      label: "Metadata",
      optional: true,
      description: "Additional JSON metadata (schema varies by type/source).",
    },
    createdByStaffUuid: {
      type: "string",
      label: "Created by staff",
      optional: true,
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
      description: "Staff member who created the attachment (`created_by_staff_uuid`).",
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.updateDboattachment({
      $,
      uuid: this.uuid,
      data: {
        related_object: this.relatedObject,
        related_object_uuid: this.relatedObjectUuid,
        attachment_name: this.attachmentName,
        file_type: this.fileType,
        attachment_source: this.attachmentSource,
        tags: this.tags,
        is_favourite: optionalBool01(this.isFavourite),
        metadata: this.metadata,
        created_by_staff_uuid: this.createdByStaffUuid,
      },
    });
    $.export("$summary", `Updated Attachment ${this.uuid}`);
    return response;
  },
};
