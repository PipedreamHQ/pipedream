import gocanvas from "../../gocanvas.app.mjs";

export default {
  key: "gocanvas-sync-reference-data",
  name: "Sync Reference Data",
  description: "Synchronizes GoCanvas reference data file with Google Sheets. [See the documentation](https://www.gocanvas.com/content/faq/post/how-to-use-reference-data-in-your-mobile-business-apps/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    gocanvas,
    referenceDataFile: {
      propDefinition: [
        gocanvas,
        "referenceDataFile",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gocanvas.syncReferenceDataFile({
      referenceDataFile: this.referenceDataFile,
    });
    $.export("$summary", `Successfully synced reference data file ${this.referenceDataFile}`);
    return response;
  },
};
