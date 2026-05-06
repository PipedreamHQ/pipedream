import { jest } from "@jest/globals";
import app from "./exa.app.mjs";
import answerQuestion from "./actions/answer-question/answer-question.mjs";
import findSimilarLinks from "./actions/find-similar-links/find-similar-links.mjs";
import getContents from "./actions/get-contents/get-contents.mjs";
import search from "./actions/search/search.mjs";

describe("Exa component payloads", () => {
  it("adds the Exa integration tracking header", () => {
    const headers = app.methods._headers.call({
      $auth: {
        api_key: "test-key",
      },
    });

    expect(headers).toEqual({
      "x-api-key": "test-key",
      "Content-Type": "application/json",
      "x-exa-integration": "PipedreamHQ/pipedream",
    });
  });

  it("builds search with nested highlights by default", async () => {
    const appStub = {
      search: jest.fn().mockResolvedValue({
        requestId: "req-1",
      }),
    };
    const exportStub = jest.fn();

    await search.run.call({
      app: appStub,
      query: "latest developments in LLMs",
    }, {
      $: {
        export: exportStub,
      },
    });

    expect(appStub.search).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        query: "latest developments in LLMs",
        contents: {
          highlights: true,
        },
      }),
    }));
    expect(appStub.search.mock.calls[0][0].data.text).toBeUndefined();
    expect(appStub.search.mock.calls[0][0].data.highlights).toBeUndefined();
    expect(appStub.search.mock.calls[0][0].data.summary).toBeUndefined();
    expect(appStub.search.mock.calls[0][0].data.context).toBeUndefined();
  });

  it("rejects invalid people filters on search", async () => {
    await expect(search.run.call({
      app: {
        search: jest.fn(),
      },
      query: "ai researchers",
      category: "people",
      excludeDomains: [
        "example.com",
      ],
    }, {
      $: {
        export: jest.fn(),
      },
    })).rejects.toThrow("The \"people\" category does not support these filters");
  });

  it("puts contents endpoint fields at the top level", async () => {
    const appStub = {
      getContents: jest.fn().mockResolvedValue({
        requestId: "req-2",
      }),
    };

    await getContents.run.call({
      app: appStub,
      urls: [
        "https://example.com",
      ],
      text: true,
      highlights: true,
      maxAgeHours: 24,
      livecrawlTimeout: 10000,
    }, {
      $: {
        export: jest.fn(),
      },
    });

    expect(appStub.getContents).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        urls: [
          "https://example.com",
        ],
        text: true,
        highlights: true,
        maxAgeHours: 24,
        livecrawlTimeout: 10000,
      }),
    }));
    expect(appStub.getContents.mock.calls[0][0].data.contents).toBeUndefined();
  });

  it("rejects contents when both urls and ids are set", async () => {
    await expect(getContents.run.call({
      app: {
        getContents: jest.fn(),
      },
      urls: [
        "https://example.com",
      ],
      ids: [
        "doc_123",
      ],
    }, {
      $: {
        export: jest.fn(),
      },
    })).rejects.toThrow("Provide either URLs or IDs, but not both.");
  });

  it("rejects contents when neither urls nor ids are set", async () => {
    await expect(getContents.run.call({
      app: {
        getContents: jest.fn(),
      },
    }, {
      $: {
        export: jest.fn(),
      },
    })).rejects.toThrow("Provide URLs or IDs.");
  });

  it("nests findSimilar content extraction and forwards moderation", async () => {
    const appStub = {
      findSimilar: jest.fn().mockResolvedValue({
        requestId: "req-3",
      }),
    };

    await findSimilarLinks.run.call({
      app: appStub,
      url: "https://arxiv.org/abs/2307.06435",
      moderation: true,
      contentsHighlights: true,
      contentsMaxAgeHours: -1,
    }, {
      $: {
        export: jest.fn(),
      },
    });

    expect(appStub.findSimilar).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        url: "https://arxiv.org/abs/2307.06435",
        moderation: true,
        contents: {
          highlights: true,
          maxAgeHours: -1,
        },
      }),
    }));
  });

  it("adds modern answer parameters and omits streaming", async () => {
    const appStub = {
      answer: jest.fn().mockResolvedValue({
        answer: "Paris",
      }),
    };

    await answerQuestion.run.call({
      app: appStub,
      query: "What is the capital of France?",
      text: true,
      systemPrompt: "Prefer primary sources.",
      outputSchema: {
        type: "object",
      },
      userLocation: "US",
    }, {
      $: {
        export: jest.fn(),
      },
    });

    expect(appStub.answer).toHaveBeenCalledWith(expect.objectContaining({
      data: {
        query: "What is the capital of France?",
        text: true,
        systemPrompt: "Prefer primary sources.",
        outputSchema: {
          type: "object",
        },
        userLocation: "US",
      },
    }));
    expect(appStub.answer.mock.calls[0][0].data.stream).toBeUndefined();
  });

  it("translates legacy context to highlights mode", async () => {
    const appStub = {
      getContents: jest.fn().mockResolvedValue({
        requestId: "req-4",
      }),
    };

    await getContents.run.call({
      app: appStub,
      urls: [
        "https://example.com",
      ],
      context: true,
    }, {
      $: {
        export: jest.fn(),
      },
    });

    expect(appStub.getContents).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        highlights: true,
      }),
    }));
    expect(appStub.getContents.mock.calls[0][0].data.context).toBeUndefined();
  });

  it("maps legacy livecrawl values and preserves preferred", async () => {
    const appStub = {
      getContents: jest.fn()
        .mockResolvedValueOnce({
          requestId: "req-5",
        })
        .mockResolvedValueOnce({
          requestId: "req-6",
        })
        .mockResolvedValueOnce({
          requestId: "req-7",
        }),
    };

    await getContents.run.call({
      app: appStub,
      urls: [
        "https://example.com",
      ],
      livecrawl: "always",
    }, {
      $: {
        export: jest.fn(),
      },
    });

    await getContents.run.call({
      app: appStub,
      urls: [
        "https://example.com",
      ],
      livecrawl: "never",
    }, {
      $: {
        export: jest.fn(),
      },
    });

    await getContents.run.call({
      app: appStub,
      urls: [
        "https://example.com",
      ],
      livecrawl: "preferred",
    }, {
      $: {
        export: jest.fn(),
      },
    });

    expect(appStub.getContents.mock.calls[0][0].data.maxAgeHours).toBe(0);
    expect(appStub.getContents.mock.calls[1][0].data.maxAgeHours).toBe(-1);
    expect(appStub.getContents.mock.calls[2][0].data.livecrawl).toBe("preferred");
  });
});
