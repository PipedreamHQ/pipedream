import app from "../../business_edge.app.mjs";
import { productReturnSchema } from "../../common/productReturnSchema.mjs";
import { normalizeDateFormatOpt } from "../../common/dateFormat.mjs";
import { isChooseOneObject } from "../../common/propUtils.mjs";

export default {
  key: "business_edge-get-products",
  name: "Get Products",
  description:
    "Retrieve products from Business Edge via `POST /masterfiles/productV3/export.json`. [See the documentation](https://hangerbolt.ci-inc.com/apilist/export)",
  version: "0.0.1",
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
    branchCode: {
      propDefinition: [
        app,
        "branchCode",
      ],
    },
    branchId: {
      propDefinition: [
        app,
        "branchId",
      ],
    },
    availBom: {
      propDefinition: [
        app,
        "availBom",
      ],
    },
    chooseOne: {
      propDefinition: [
        app,
        "chooseOne",
      ],
      description:
        "Search, Range, or List per API (Range wins over list over search). Example: `{ \"Search\": \"bolt\" }`",
    },
  },
  async run({ $ }) {
    const {
      entity,
      dateFormatOpt,
      dateDelim,
      savedSchemaId,
      savedSchemaCode,
      branchCode,
      branchId,
      availBom,
      chooseOne,
    } = this;

    const fmt = normalizeDateFormatOpt(dateFormatOpt);
    const body = {
      Entity: entity,
      DateFormatOpt: fmt,
      DateDelim: dateDelim,
      SavedSchemaID: savedSchemaId,
      SavedSchemaCode: savedSchemaCode,
      BranchCode: branchCode,
      BranchID: branchId,
      AvailBOM: availBom,
      ...productReturnSchema,
    };

    if (isChooseOneObject(chooseOne)) {
      body.ChooseOne = chooseOne;
    }

    const data = await this.app.postExport({
      $,
      endpoint: "/masterfiles/productV3/export.json",
      data: body,
    });

    const products = Array.isArray(data?.Product)
      ? data.Product
      : [];
    $.export(
      "$summary",
      `Successfully retrieved ${products.length} products`,
    );
    return data;
  },
};
