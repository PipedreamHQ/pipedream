// legacy_hash_id: a_l0iQMl
import fs from "fs";
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_crm-download-attachment",
  name: "Download Attachment",
  description: "Downloads an attachment file from Zoho CRM, saves it in the temporary file system and exports the file path for use in a future step.",
  version: "0.1.2",
  type: "action",
  props: {
    // eslint-disable-next-line pipedream/props-label
    // eslint-disable-next-line pipedream/props-description
    zoho_crm: {
      type: "app",
      app: "zoho_crm",
    },
    // eslint-disable-next-line pipedream/props-description
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
    // eslint-disable-next-line pipedream/props-description
    record_id: {
      type: "string",
      label: "Record ID",
    },
    // eslint-disable-next-line pipedream/props-description
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
