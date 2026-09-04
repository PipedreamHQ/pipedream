import { ConfigurationError } from "@pipedream/platform";
import app from "./linear_app.app.mjs";

/**
 * Calls `post()` against a canned reply. The platform normally hoists an app's
 * methods onto the instance it hands a component, so the context is rebuilt
 * here from `app.methods` with the transport stubbed out.
 *
 * @param {object} response - the body `makeAxiosRequest` should resolve to
 * @returns {Promise<object>} whatever `post()` makes of it
 */
const postWith = (response) => {
  const ctx = Object.create(app.methods);
  ctx.makeAxiosRequest = async () => response;
  return app.methods.post.call(ctx, {});
};

describe("post", () => {
  it("returns the response untouched when the query succeeds", async () => {
    const response = {
      data: {
        issues: {
          nodes: [],
        },
      },
    };
    await expect(postWith(response)).resolves.toBe(response);
  });

  // Linear answers a rejected query with HTTP 200 and `data: null`, so nothing
  // upstream of here treats it as a failure
  it("raises a ConfigurationError the caller can act on", async () => {
    await expect(postWith({
      data: null,
      errors: [
        {
          message: "Argument Validation Error",
          extensions: {
            code: "INVALID_INPUT",
            userError: true,
          },
        },
      ],
    })).rejects.toBeInstanceOf(ConfigurationError);
  });

  it("keeps a rate limit retryable", async () => {
    const promise = postWith({
      data: null,
      errors: [
        {
          message: "Rate limit exceeded",
          extensions: {
            code: "RATELIMITED",
            userError: false,
          },
        },
      ],
    });
    await expect(promise).rejects.toThrow("Rate limit exceeded");
    await expect(promise).rejects.not.toBeInstanceOf(ConfigurationError);
  });

  it("does not blame the configuration when only some errors are user errors", async () => {
    const promise = postWith({
      data: null,
      errors: [
        {
          message: "Argument Validation Error",
          extensions: {
            userError: true,
          },
        },
        {
          message: "Internal server error",
          extensions: {
            userError: false,
          },
        },
      ],
    });
    await expect(promise).rejects.not.toBeInstanceOf(ConfigurationError);
    await expect(promise).rejects.toThrow("Argument Validation Error; Internal server error");
  });

  it("reports an empty response rather than letting it through", async () => {
    await expect(postWith({})).rejects.toThrow("The Linear API returned an empty response");
  });
});
