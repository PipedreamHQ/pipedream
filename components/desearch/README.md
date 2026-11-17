# Desearch

Search the web and retrieve titles, links, and snippets with Desearch.

Connect a Desearch account using the `api_key` authentication field. The app uses the connected account's `$auth.api_key` as a bearer token.

The Web Search action sends one GET request to `https://api.desearch.ai/web` with the required `query` parameter. It returns the API response unchanged, including its `data` array. The API returns up to 20 results per request and supports pagination through `start`, the number of results to skip. This action uses the default `start=0` and does not expose pagination or a result-count control. [See the API documentation](https://www.desearch.ai/docs/api-reference/get-web).

Run the isolated mocked tests from this directory with `npm test`. No dependency installation is needed for the harness. It loads the component modules with a mocked platform HTTP client and authentication object.

Run `npm run live_check --silent` with `DESEARCH_API_KEY` set in the environment to make one search for `bittensor`. The check reads the key only from that environment variable and prints the result count and first title.
