import axios from "@pipedream/platform";

export default {
  name: "Get Table",
  description: "Retrieve a table from an Excel spreadsheet stored in OneDrive",
  key: "microsoft_onedrive-get-excel-table",
  version: "0.0.1",
  type: "action",
  props: {
    microsoft_onedrive: {
      type: "app",
      app: "microsoft_onedrive",
      label: "",
      description: "",
    },
    itemId: {
      type: "string",
      label: "Spreadsheet",
      description: "Search for the file by name, only xlsx files are supported",
      useQuery: true,
      async options( context ) {
        const response = await axios(context, {
          url: `https://graph.microsoft.com/v1.0/me/drive/search(q='${context?.query ?? ""} .xlsx')?select=name,id`,
          headers: {
            Authorization: `Bearer ${this.microsoft_onedrive.$auth.oauth_access_token}`,
          },
        });
        const filtered = response.value.filter(
          ( { name } ) => { return name.substring(name.length - 4) == "xlsx"; },
        );
        return filtered.map( function ({
          name, id,
        }) {
          return ({
            label: name,
            value: id,
          });
        });
      },
    },
    tableName: {
      type: "string",
      label: "Table name",
      description: "This is set in the **Table Design** tab of the ribbon.",
      async options( context ) {
        const response = await axios(context, {
          url: `https://graph.microsoft.com/v1.0/me/drive/items/${this.itemId}/workbook/tables?$select=name`,
          headers: {
            Authorization: `Bearer ${this.microsoft_onedrive.$auth.oauth_access_token}`,
          },
        });
        return response.value.map( function ({ name }) {
          return ({
            label: name,
            value: name,
          });
        });
      },
    },
    removeHeaders: {
      type: "boolean",
      label: "Remove headers?",
      optional: true,
      description: "By default, The headers are included as the first row.",
      default: false,
    },
    numberOfRows: {
      type: "integer",
      optional: true,
      default: 0,
      min: 0,
      label: "Number of rows to return (optional)",
      description: "Leave blank to return all rows.",
    },
  },
  async run({ $ }) {
    const range = await axios($, {
      url: `https://graph.microsoft.com/v1.0/me/drive/items/${this.itemId}/workbook/tables/${this.tableName}/range`,
      headers: {
        Authorization: `Bearer ${this.microsoft_onedrive.$auth.oauth_access_token}`,
      },
    });

    return this.removeHeaders
      ? this.numberOfRows <= 0
        ? range.text.slice(1)
        : range.text.slice(1, this.numberOfRows + 1)
      : this.numberOfRows <= 0
        ? range.text
        : range.text.slice(0, this.numberOfRows + 1);
  },
};
