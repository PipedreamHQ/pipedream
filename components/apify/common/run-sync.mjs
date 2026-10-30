import { unwrapDatasetItems } from "./utils.mjs";

// Runs an Actor and returns its dataset items.
// actorId is owner~name, for example vncntlabs~keyword-search-volume.
// https://docs.apify.com/api/v2/act-run-sync-get-dataset-items-post
export const runSyncGetDatasetItems = async (apify, {
  actorId,
  input,
}) => {
  const client = apify._client();
  const response = await client.httpClient.call({
    url: `${client.baseUrl}/v2/actors/${actorId}/run-sync-get-dataset-items`,
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    data: input,
  });
  const items = unwrapDatasetItems(response);

  if (!Array.isArray(items)) {
    throw new Error("Apify did not return dataset items.");
  }

  return items;
};
