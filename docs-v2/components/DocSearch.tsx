import { DocSearch } from "@docsearch/react";

import "@docsearch/css";

function Search() {
  return (
    <DocSearch
      appId={process.env.ALGOLIA_APP_ID}
      indexName={process.env.ALGOLIA_INDEX_NAME}
      apiKey={process.env.ALGOLIA_SEARCH_API_KEY}
      searchParameters={{
        facetFilters: [
          "version:latest",
        ],
      }}
      transformItems={(items) => {
        return items.map((item) => ({
          ...item,
          content: item.url,
        }));
      }}
    />
  );
}

export default Search;
