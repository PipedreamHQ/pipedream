export default [
  {
    value: "AccountCategoriesUpdated",
    label: "Triggered anytime a company's accounts are categorized. This can be when Codat updates the suggested category fields or a user updates the confirmed category fields.",
  },
  {
    value: "bankFeeds.sourceAccount.connected",
    label: "Indicates a bank feed source account has changed to a status of connected.",
  },
  {
    value: "bankFeeds.sourceAccount.disconnected",
    label: "Indicates a bank feed source account has changed to a status of disconnected.",
  },
  {
    value: "ClientRateLimitReached",
    label: "Triggered when the number of requests to Codat's API from the client exceeds the current quota.",
  },
  {
    value: "ClientRateLimitReset",
    label: "Triggered when the rate limit quota has reset for the client, and more requests to the API are available.",
  },
  {
    value: "DataConnectionStatusChanged",
    label: "Triggered when a data connection status of a specific company changes.",
  },
  {
    value: "DataSyncCompleted",
    label: "  Generated for each dataType to indicate that data synchronization is successfully completed for that specific data type.",
  },
  {
    value: "DataSyncStatusChangedToError",
    label: "Triggered when the synchronization of a dataset fails.",
  },
  {
    value: "DatasetDataChanged",
    label: "  Generated for each dataType to indicate that dataset synchronization has completed and updated Codat's data cache through the creation of new records or a change to existing records.",
  },
  {
    value: "NewCompanySynchronized",
    label: "Triggered when initial syncs are complete for all data types queued for a newly connected company, and at least one of those syncs is successful.",
  },
  {
    value: "PushOperationStatusChanged",
    label: "Indicates that a create, update, or delete operation's status has changed. You can learn more about push operations at Codat.",
  },
  {
    value: "PushOperationTimedOut",
    label: "Indicates that a create, update, or delete operation has timed out. You can learn more about timeouts for push operations at Codat.",
  },
  {
    value: "SyncCompleted",
    label: "Triggered anytime an expense sync completes. Used for Sync for Expenses only.",
  },
  {
    value: "SyncConnectionDeleted",
    label: "Indicates a Sync for Commerce connection has been deleted. Used for Sync for Commerce only.",
  },
  {
    value: "SyncFailed",
    label: "Indicates a failure occurred during an expense sync. Used for Sync for Expenses only.",
  },
];
