/**
 * Return schema for branch export (List Branches and branch option loaders).
 */
export const branchReturnSchema = {
  Branch: [
    {
      BrCode: true,
      BrDesc: true,
      BranchID: true,
      BrName: true,
      Active: true,
    },
  ],
};
