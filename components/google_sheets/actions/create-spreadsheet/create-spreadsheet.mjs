import googleSheets from "../../google_sheets.app.mjs";

export default {
  key: "google_sheets-create-spreadsheet",
  name: "Create Spreadsheet",
  description: "Create a blank spreadsheet or duplicate an existing spreadsheet. [See the documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/create)",
  version: "0.1.7",
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
  async run() {
    const {
      googleSheets,
      sheetId,
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

    if (sheetId) {
      return copySpreadsheet(sheetId, title);
    }

    const response = await createSpreadsheet({
      resource: {
        properties: {
          title,
        },
      },
    });

    if (isMyDrive(drive)) {
      return response;
    }

    const spreadsheet = await updateFile(response.spreadsheetId, {
      addParents: drive,
    });

    return getSpreadsheet(spreadsheet.id);
  },
};
