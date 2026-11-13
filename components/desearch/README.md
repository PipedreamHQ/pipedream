# Desearch

Search the web and retrieve titles, links, and snippets with Desearch.

Connect a Desearch account using the `api_key` authentication field. The app uses the connected account's `$auth.api_key` as a bearer token.

The Web Search action sends one GET request to `https://api.desearch.ai/web` with `query` and optional `num` parameters. It returns the API response unchanged, including its `data` array. The number of results is controlled by the API.

Run the isolated mocked tests from this directory with `npm test`. No dependency installation is needed for the harness. It loads the component modules with a mocked platform HTTP client and authentication object.

Run `npm run live_check --silent` with `DESEARCH_API_KEY` set in the environment to make one search for `bittensor`. The check reads the key only from that environment variable and prints the result count and first title.
