// Modules have 3 special flags called `creatable`, `deletable` and
// `editable`, which provide information about the supported CRUD
// operations for a particular record type (a.k.a. "module"). Further
// information about each flag can be found in the docs:
// https://www.zoho.com/crm/developer/docs/api/v2/modules-api.html
const crudOpsData = [
  {
    op: "create",
    flagName: "creatable",
    description: "Creation",
  },
  {
    op: "delete",
    flagName: "deletable",
    description: "Deletion",
  },
  {
    op: "edit",
    flagName: "editable",
    description: "Edition",
  },
];

const getOpData = (inputOp) => crudOpsData.find(({ op }) => op === inputOp);

/* eslint-disable pipedream/required-properties-key, pipedream/required-properties-name,
  pipedream/required-properties-version, pipedream/required-properties-description,
  pipedream/required-properties-type */
export default {
  createOpData() {
    return getOpData("create");
  },
  deleteOpData() {
    return getOpData("delete");
  },
  editOpData() {
    return getOpData("edit");
  },
  allOpsData() {
    return crudOpsData;
  },
};
