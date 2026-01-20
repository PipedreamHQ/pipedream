import _descript from "../../_descript.app.mjs";

export default {
  key: "_descript-create-import-url",
  name: "Create Import URL",
  description: "Create an import URL for a published project. [See the documentation](https://docs.descriptapi.com/#tag/Edit-in-Descript/operation/postEditInDescriptSchema)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    _descript,
    partnerDriveId: {
      type: "string",
      label: "Partner Drive ID",
      description: "The drive ID to use for the import URL, visible at the end of the URL when viewing the Drive Workspace. (Does not include leading \"-d\" or \"-p\"). Example: `98130bf1-9471-4f5d-915b-bf286c230b8f`",
    },
    uri: {
      type: "string",
      label: "URI",
      description: "A public/pre-signed uri to the audio or video asset. Supported Audio: WAV, FLAC, AAC, MP3; Supported Video: h264, HEVC (container: MOV, MP4)",
    },
    sourceId: {
      type: "string",
      label: "Source ID",
      description: "External source ID to be included in Descript export pages. This ID is not currently used to deduplicate data coming into Descript, a new Project is created for each import.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "A name for the file",
      optional: true,
    },
    startOffset: {
      type: "string",
      label: "Start Offset",
      description: "The number of seconds into the Project's timeline this audio or video file should start at",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this._descript.createImportUrl({
      $,
      data: {
        partner_drive_id: this.partnerDriveId,
        project_schema: {
          schema_version: "1.0.0",
          source_id: this.sourceId,
          files: [
            {
              name: this.name,
              uri: this.uri,
              start_offset: this.startOffset
                ? {
                  seconds: parseFloat(this.startOffset),
                }
                : undefined,
            },
          ],
        },
      },
    });

    $.export("$summary", `Successfully created import URL: \`${response.url}\``);
    return response;
  },
};
