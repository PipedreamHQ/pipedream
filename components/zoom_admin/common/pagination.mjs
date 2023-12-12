export const paginate = async (fn, dataPropName, ...fnParams) => {
  const data = [];

  let nextPageToken;
  do {
    const res = await fn(...fnParams, nextPageToken);
    data.push(...res[dataPropName]);
    nextPageToken = res.next_page_token;
  } while (nextPageToken);

  return data;
};
