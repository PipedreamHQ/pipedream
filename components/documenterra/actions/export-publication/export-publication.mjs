import app from "../../documenterra.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "documenterra-export-publication",
  name: "Export Publication",
  description: "Exports an existing publication to a user-selected format. [See the documentation](https://documenterra.ru/docs/user-manual/api-eksport-publikatsii.html)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    projectId: {
      label: "Publication ID",
      description: "The unique identifier for the publication.",
      propDefinition: [
        app,
        "projectId",
        () => ({
          filter: ({ parentId }) => !!parentId,
        }),
      ],
    },
    outputFileName: {
      description: "The full name of the output file. If the output file is saved to Documenterra's file storage (the default), the full file name must be specified, including the file path starting with `Storage/` Eg. `Storage/export-files/deep-space-1.0-docs.zip`.",
      propDefinition: [
        app,
        "outputFileName",
      ],
    },
    format: {
      type: "string",
      label: "Format",
      description: "The format of the publication to be exported.",
      options: constants.PRINTED_FORMAT_OPTIONS.concat(constants.OTHER_FORMAT_OPTIONS),
      reloadProps: true,
    },
  },
  additionalProps() {
    const {
      app,
      format,
    } = this;

    const isPrintedFormat = constants.PRINTED_FORMAT_OPTIONS.some(({ value }) => value === format);

    if (!isPrintedFormat) {
      return {};
    }
    return {
      exportPresetName: {
        type: "string",
        label: "Export Preset Name",
        description: `Full name of the Export Preset used. [See the settings page here](${app.getBaseUrl()}/settings/export-presets)`,
        default: "Default",
      },
    };
  },
  async run({ $ }) {
    const {
      app,
      projectId,
      format,
      outputFileName,
      exportPresetName,
    } = this;

    const response = await app.createProject({
      $,
      projectId,
      params: {
        action: "export",
      },
      data: {
        format,
        outputFileName,
        exportPresetName,
      },
    });

    $.export("$summary", `Successfully exported publication with task key \`${response.taskKey}\`.`);
    return response;
  },
};
