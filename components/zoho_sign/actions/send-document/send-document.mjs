import zohoProjects from "../../zoho_sign.app.mjs";

export default {
  key: "zoho_sign-send-document",
  name: "Send Document",
  description: "Sends a document to the designated recipients for their signatures. [See the documentation](https://www.zoho.com/sign/api/#send-document-for-signature)",
  type: "action",
  version: "0.0.1",
  props: {
    zohoProjects,
    documentId: {
      propDefinition: [
        zohoProjects,
        "documentId",
      ],
    },
  },
  /*async run({ $ }) {

  },*/
};
