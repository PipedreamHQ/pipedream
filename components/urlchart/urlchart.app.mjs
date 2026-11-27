import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "urlchart",
  propDefinitions: {
    params: {
      type: "string",
      label: "Chart Parameters",
      description: "The chart to render, written as legacy Google Image Charts query parameters, e.g. `cht=bvs&chs=600x400&chd=t:10,20,30&chtt=Monthly+sales&chl=Jan|Feb|Mar`"
        + " (`cht` is the chart type, `chs` the image size in pixels, `chd` the data, `chtt` the title and `chl` the series labels)."
        + " `|` separates series and labels and `+` is a space, so pass the parameters exactly as they would appear in a chart URL, without URL-encoding them."
        + " Full parameter reference: [legacy parameter reference](https://urlchart.com/docs/parameters).",
    },
  },
  methods: {
    _baseUrl() {
      return "https://urlchart.com";
    },
    _headers(headers = {}) {
      return {
        // UrlChart's free tier needs no key, so the header is only sent when a
        // key is actually configured on the connected account.
        ...(this.$auth?.api_key
          ? {
            "x-api-key": this.$auth.api_key,
          }
          : {}),
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...opts,
      });
    },
    /**
     * Renders a chart and returns the full axios response, so the caller has the
     * `status`, the `content-type` header and the PNG `data` (an ArrayBuffer).
     *
     * The legacy query string is passed through untouched: `params` is the raw
     * string and the identity `serialize` keeps it byte for byte. Sending it as
     * part of the URL instead would make the platform's axios move it into a
     * params object and re-encode it (`+` becomes `%2B`, and a lone `%` in a
     * value throws before the request is made).
     * @param {object} opts - Request options.
     * @param {string} opts.params - The legacy query string, e.g.
     * `cht=bvs&chs=600x400&chd=t:10,20,30`.
     * @returns {Promise<object>} The axios response, whose `data` is the image bytes.
     */
    createChartImage({
      $ = this, params, ...opts
    } = {}) {
      return this._makeRequest({
        $,
        path: "/chart",
        params,
        paramsSerializer: {
          serialize: (query) => query,
        },
        responseType: "arraybuffer",
        returnFullResponse: true,
        ...opts,
      });
    },
  },
};
