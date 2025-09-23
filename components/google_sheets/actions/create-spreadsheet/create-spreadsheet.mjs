import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-create-spreadsheet",
  name: "Create Spreadsheet",
  description: "Create a blank spreadsheet or duplicate an existing spreadsheet. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/create)",
  version: "0.1.13",
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
      description: "The drive to create the new spreadsheet in. If you are connected with any [Google Shared Drives](https://support.google.com/a/users/answer/9310351), you can select it here.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the new spreadsheet",
    },
    folderId: {
      propDefinition: [
        googleSheets,
        "folderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The folder you want to save the file to",
      optional: true,
    },
    sheetId: {
      propDefinition: [
        googleSheets,
        "sheetID",
        (c) => ({
          driveId: googleSheets.methods.getDriveId(c.drive),
        }),
      ],
      description: "The Google spreadsheet to copy",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      googleSheets,
      sheetId,
      folderId,
      title,
      drive,
    } = this;

    const {
      copySpreadsheet,
      createSpreadsheet,
      getSpreadsheet,
      updateFile,
      isMyDrive,
    } = googleSheets;

    let response;
    if (sheetId) {
      response = await copySpreadsheet(sheetId, title);
    } else {
      response = await createSpreadsheet({
        resource: {
          properties: {
            title,
          },
        },
      });
    }

    const spreadsheetId = response?.spreadsheetId || response?.id;
    const summary = `Successfully created spreadsheet with ID: ${spreadsheetId}`;

    if (!folderId && isMyDrive(drive)) {
      $.export("$summary", summary);
      return response;
    }

    const spreadsheet = await updateFile(spreadsheetId, {
      addParents: folderId || drive,
    });

    $.export("$summary", summary);
    return getSpreadsheet(spreadsheet.id);
  },
};
