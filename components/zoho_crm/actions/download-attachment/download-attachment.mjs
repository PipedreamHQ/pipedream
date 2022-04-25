// legacy_hash_id: a_l0iQMl
import fs from "fs";
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_crm-download-attachment",
  name: "Download Attachment",
  description: "Downloads an attachment file from Zoho CRM, saves it in the temporary file system and exports the file path for use in a future step.",
  version: "0.1.1",
  type: "action",
  props: {
    zoho_crm: {
      type: "app",
      app: "zoho_crm",
    },
    module: {
      type: "string",
      label: "Module",
      options: [
        "Leads",
        "Accounts",
        "Contacts",
        "Deals",
        "Campaigns",
        "Tasks",
        "Cases",
        "Events",
        "Calls",
        "Solutions",
        "Products",
        "Vendors",
        "Price_Books",
        "Quotes",
        "Sales_Orders",
        "Purchase_Orders",
        "Invoices",
        "Custom",
        "Activities",
      ],
    },
    record_id: {
      type: "string",
      label: "Record ID",
    },
    attachment_id: {
      type: "string",
      label: "Attachment ID",
    },
  },
  async run({ $ }) {
    const file = await axios($, {
      url: `${this.zoho_crm.$auth.api_domain}/crm/v2/${this.module}/${this.record_id}/Attachments/${this.attachment_id}`,
      headers: {
        "Authorization": `Zoho-oauthtoken ${this.zoho_crm.$auth.oauth_access_token}`,
      },
      responseType: "arraybuffer",
    });

    const filePath = "/tmp/" + this.attachment_id;
    fs.writeFileSync(filePath, file);

    $.export("file_path", filePath);
  },
};
