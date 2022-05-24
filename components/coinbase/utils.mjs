export default {
  getAccountOptions(accounts) {
    return accounts.map((account) => ({
      label: account.name,
      value: account.id,
    }));
  },
};
