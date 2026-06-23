import app from "../../business_edge.app.mjs";
import { branchReturnSchema } from "../../common/branchReturnSchema.mjs";
import { normalizeDateFormatOpt } from "../../common/dateFormat.mjs";

export default {
  key: "business_edge-list-branches",
  name: "List Branches",
  description:
    "Retrieve branches from Business Edge via `POST /masterfiles/branch/export.json`. [See the documentation](https://hangerbolt.ci-inc.com/apilist/export)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    entity: {
      propDefinition: [
        app,
        "entity",
      ],
    },
    dateFormatOpt: {
      propDefinition: [
        app,
        "dateFormatOpt",
      ],
    },
    dateDelim: {
      propDefinition: [
        app,
        "dateDelim",
      ],
    },
    savedSchemaId: {
      propDefinition: [
        app,
        "savedSchemaId",
      ],
    },
    savedSchemaCode: {
      propDefinition: [
        app,
        "savedSchemaCode",
      ],
    },
    onlyActive: {
      type: "boolean",
      label: "Only Active (OnlyActive)",
      description: "When true, return only active branches",
      optional: true,
      default: true,
    },
  },
  async run({ $ }) {
    const {
      entity,
      dateFormatOpt,
      dateDelim,
      savedSchemaId,
      savedSchemaCode,
      onlyActive,
    } = this;

    const fmt = normalizeDateFormatOpt(dateFormatOpt);
    const body = {
      Entity: entity,
      DateFormatOpt: fmt,
      DateDelim: dateDelim,
      SavedSchemaID: savedSchemaId,
      SavedSchemaCode: savedSchemaCode,
      OnlyActive: onlyActive !== false,
      ...branchReturnSchema,
    };

    const data = await this.app.postExport({
      $,
      endpoint: "/masterfiles/branch/export.json",
      data: body,
    });

    const branches = Array.isArray(data?.Branch)
      ? data.Branch
      : [];
    $.export(
      "$summary",
      `Successfully retrieved ${branches.length} branches`,
    );
    return data;
  },
};
