import app from "../../cloze.app.mjs";

export default {
  key: "cloze-create-note",
  name: "Create Note",
  description: "Creates a note in Cloze. [See the documentation](https://api.cloze.com/api-docs/#!/Content/post_v1_createcontent).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    uniqueId: {
      type: "string",
      label: "Unique ID",
      description: "A unique identifier for this content record. This will often be the unique Id in an external system so that updates can be matched up with the record in Cloze.",
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source that this content record originally came from (Eg. `todoist.com`). Must be a valid domain.",
    },
    date: {
      type: "string",
      label: "Date",
      description: "When the content should show up in the timeline. Can be a string or a UTC timestamp in ms since the epoch. Eg. `2021-01-01` or `1609459200000`.",
      optional: true,
    },
    from: {
      type: "string",
      label: "From",
      description: "From address for this content record (the address of the person created the record). This can be an email address, phone number, social handle or app link (Eg. `na16.salesforce.com:006j000000Pkp1d`)",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the communication record.",
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "Body text of the communication record.",
    },
    additionalData: {
      type: "object",
      label: "Additional Data",
      description: "Additional details for the note in JSON format. [See the documentation](https://api.cloze.com/api-docs/#!/Content/post_v1_createcontent).",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      uniqueId,
      date,
      from,
      source,
      subject,
      body,
      additionalData,
    } = this;

    const response = await app.addContentRecord({
      $,
      data: {
        uniqueid: uniqueId,
        date,
        style: "note",
        from,
        source,
        subject,
        body,
        ...additionalData,
      },
    });

    $.export("$summary", "Successfully created note.");

    return response;
  },
};
