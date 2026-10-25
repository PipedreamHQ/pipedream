const unwrapDatasetItems = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (response && Array.isArray(response.data)) {
    return response.data;
  }

  if (response && response.status && response.data !== undefined) {
    return response.data;
  }

  return response;
};

export const buildActorInput = (input) => {
  const result = {};

  for (const [
    key,
    value,
  ] of Object.entries(input)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    if (Array.isArray(value) && value.length === 0) {
      continue;
    }

    result[key] = value;
  }

  return result;
};

export const formatCount = (count, singular, pluralForm) => {
  const word = count === 1
    ? singular
    : pluralForm;

  return `${count} ${word}`;
};

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
