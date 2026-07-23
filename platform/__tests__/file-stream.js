jest.mock("undici", () => {
  const actual = jest.requireActual("undici");
  return {
    ...actual,
    fetch: jest.fn((...args) => actual.fetch(...args)),
  };
});

const {
  getFileStream, getFileStreamAndMetadata,
} = require("../dist");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { fetch: mockFetch } = require("undici");

// Helper function to read content from a readable stream
async function readStreamContent(stream) {
  let content = "";
  stream.on("data", (chunk) => {
    content += chunk.toString();
  });

  await new Promise((resolve) => {
    stream.on("end", resolve);
  });

  return content;
}

// Helper function to wait for stream cleanup by listening to close event
async function waitForStreamCleanup(stream) {
  return new Promise((resolve) => {
    stream.on("close", resolve);
  });
}

// The remote-URL tests below mock the fetch transport rather than hitting a real
// server, since fetching from `localhost` is exactly what the SSRF guard in
// file-stream.ts is meant to reject (see the "SSRF protection" tests).
function mockRemoteResponse(body, {
  status = 200, statusText = "OK", headers = {},
} = {}) {
  mockFetch.mockResolvedValueOnce(new Response(body, {
    status,
    statusText,
    headers,
  }));
}

describe("file-stream", () => {
  let testFilePath;

  beforeAll(() => {
    // Create a test file
    testFilePath = path.join(__dirname, "test-file.txt");
    fs.writeFileSync(testFilePath, "test content for file stream");
  });

  afterAll(() => {
    // Clean up test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  afterEach(() => {
    mockFetch.mockClear();
  });

  describe("getFileStream", () => {
    it("should return readable stream for local file", async () => {
      const stream = await getFileStream(testFilePath);
      expect(stream).toBeDefined();
      expect(typeof stream.read).toBe("function");

      const content = await readStreamContent(stream);
      expect(content).toBe("test content for file stream");
    });

    it("should return readable stream for remote URL", async () => {
      mockRemoteResponse("test content for file stream", {
        headers: {
          "Content-Type": "text/plain",
        },
      });

      const stream = await getFileStream("https://example.com/test-file.txt");
      expect(stream).toBeDefined();
      expect(typeof stream.read).toBe("function");

      const content = await readStreamContent(stream);
      expect(content).toBe("test content for file stream");
    });

    it("should throw error for invalid URL", async () => {
      mockRemoteResponse(null, {
        status: 404,
        statusText: "Not Found",
      });

      await expect(getFileStream("https://example.com/error"))
        .rejects.toThrow("Failed to fetch");
    });

    it("should throw error for non-existent local file", async () => {
      await expect(getFileStream("/non/existent/file.txt"))
        .rejects.toThrow();
    });
  });

  describe("getFileStreamAndMetadata", () => {
    it("should return stream and metadata for local file", async () => {
      const result = await getFileStreamAndMetadata(testFilePath);

      expect(result.stream).toBeDefined();
      expect(typeof result.stream.read).toBe("function");
      expect(result.metadata).toMatchObject({
        size: 28,
        name: "test-file.txt",
      });
      expect(result.metadata.lastModified.constructor.name).toBe("Date");
      const content = await readStreamContent(result.stream);
      expect(content).toBe("test content for file stream");
    });

    it("should return stream and metadata for remote file with content-length", async () => {
      mockRemoteResponse("test content for file stream", {
        headers: {
          "Content-Type": "text/plain",
          "Content-Length": "28",
          "Last-Modified": new Date().toUTCString(),
          "ETag": "\"test-etag\"",
        },
      });

      const result = await getFileStreamAndMetadata("https://example.com/test-file.txt");

      expect(result.stream).toBeDefined();
      expect(typeof result.stream.read).toBe("function");
      expect(result.metadata).toMatchObject({
        size: 28,
        contentType: "text/plain",
        name: "test-file.txt",
        etag: "\"test-etag\"",
      });
      expect(result.metadata.lastModified).toBeInstanceOf(Date);
      const content = await readStreamContent(result.stream);
      expect(content).toBe("test content for file stream");
    });

    it("should handle remote file without content-length", async () => {
      mockRemoteResponse("{\"test\": \"data\"}", {
        headers: {
          "Content-Type": "application/json",
          "Last-Modified": new Date().toUTCString(),
        },
      });

      const result = await getFileStreamAndMetadata("https://example.com/no-content-length");

      expect(result.stream).toBeDefined();
      expect(typeof result.stream.read).toBe("function");

      expect(result.metadata).toMatchObject({
        size: 16, // Size determined after download
        contentType: "application/json",
      });
      expect(result.metadata.lastModified).toBeInstanceOf(Date);

      const content = await readStreamContent(result.stream);
      expect(content).toBe("{\"test\": \"data\"}");
    });

    it("should throw error for invalid remote URL", async () => {
      mockRemoteResponse(null, {
        status: 404,
        statusText: "Not Found",
      });

      await expect(getFileStreamAndMetadata("https://example.com/error"))
        .rejects.toThrow("Failed to fetch");
    });
  });

  describe("SSRF protection", () => {
    it("should reject remote URLs pointing at localhost", async () => {
      await expect(getFileStream("http://localhost:65535/"))
        .rejects.toThrow(/private or reserved/);
    });

    it("should reject remote URLs pointing at a private or reserved literal IP", async () => {
      await expect(getFileStreamAndMetadata("http://169.254.169.254/latest/meta-data"))
        .rejects.toThrow(/private or reserved/);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should reject a redirect to a private or reserved address", async () => {
      mockRemoteResponse(null, {
        status: 302,
        statusText: "Found",
        headers: {
          Location: "http://169.254.169.254/latest/meta-data",
        },
      });

      await expect(getFileStream("https://example.com/redirect"))
        .rejects.toThrow(/private or reserved/);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("temporary file cleanup", () => {
    it("should clean up temporary files after stream ends", async () => {
      mockRemoteResponse("{\"test\": \"data\"}", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const tmpDir = os.tmpdir();
      const tempFilesBefore = fs.readdirSync(tmpDir);
      const result = await getFileStreamAndMetadata("https://example.com/no-content-length");

      const content = await readStreamContent(result.stream);
      // Wait for cleanup to complete by listening to close event
      await waitForStreamCleanup(result.stream);

      // Check that temp files were cleaned up
      const tempFilesAfter = fs.readdirSync(tmpDir);
      expect(tempFilesAfter.length).toEqual(tempFilesBefore.length);
      expect(content).toBe("{\"test\": \"data\"}");
    });

    it("should clean up temporary files on stream error", async () => {
      mockRemoteResponse("{\"test\": \"data\"}", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check temp files before
      const tmpDir = os.tmpdir();
      const tempFilesBefore = fs.readdirSync(tmpDir);

      const result = await getFileStreamAndMetadata("https://example.com/no-content-length");

      // Trigger an error and wait for cleanup
      result.stream.destroy(new Error("Test error"));
      await waitForStreamCleanup(result.stream);

      // Check that temp files were cleaned up
      const tempFilesAfter = fs.readdirSync(tmpDir);
      expect(tempFilesAfter.length).toEqual(tempFilesBefore.length);
    });
  });
});
