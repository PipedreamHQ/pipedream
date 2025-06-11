const {
  getFileStream, getFileStreamAndMetadata,
} = require("../dist");
const fs = require("fs");
const path = require("path");
const http = require("http");
const os = require("os");

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

describe("file-stream", () => {
  let testFilePath;
  let server;
  const testPort = 3892;

  beforeAll(() => {
    // Create a test file
    testFilePath = path.join(__dirname, "test-file.txt");
    fs.writeFileSync(testFilePath, "test content for file stream");

    // Create a simple HTTP server for testing remote files
    server = http.createServer((req, res) => {
      if (req.url === "/test-file.txt") {
        res.writeHead(200, {
          "Content-Type": "text/plain",
          "Content-Length": "28",
          "Last-Modified": new Date().toUTCString(),
          "ETag": "\"test-etag\"",
        });
        res.end("test content for file stream");
      } else if (req.url === "/no-content-length") {
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Last-Modified": new Date().toUTCString(),
        });
        res.end("{\"test\": \"data\"}");
      } else if (req.url === "/error") {
        res.writeHead(404, "Not Found");
        res.end();
      } else {
        res.writeHead(404, "Not Found");
        res.end();
      }
    });

    return new Promise((resolve) =>
      server.listen(testPort, resolve));
  });

  afterAll(() => {
    // Clean up test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }

    if (server) {
      return new Promise((resolve) =>
        server.close(resolve));
    }
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
      const stream = await getFileStream(`http://localhost:${testPort}/test-file.txt`);
      expect(stream).toBeDefined();
      expect(typeof stream.read).toBe("function");

      const content = await readStreamContent(stream);
      expect(content).toBe("test content for file stream");
    });

    it("should throw error for invalid URL", async () => {
      await expect(getFileStream(`http://localhost:${testPort}/error`))
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
      const result = await getFileStreamAndMetadata(`http://localhost:${testPort}/test-file.txt`);

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
      const result = await getFileStreamAndMetadata(`http://localhost:${testPort}/no-content-length`);

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
      await expect(getFileStreamAndMetadata(`http://localhost:${testPort}/error`))
        .rejects.toThrow("Failed to fetch");
    });
  });

  describe("temporary file cleanup", () => {
    it("should clean up temporary files after stream ends", async () => {
      const tmpDir = os.tmpdir();
      const tempFilesBefore = fs.readdirSync(tmpDir);
      const result = await getFileStreamAndMetadata(`http://localhost:${testPort}/no-content-length`);

      const content = await readStreamContent(result.stream);
      // Wait for cleanup to complete by listening to close event
      await waitForStreamCleanup(result.stream);

      // Check that temp files were cleaned up
      const tempFilesAfter = fs.readdirSync(tmpDir);
      expect(tempFilesAfter.length).toEqual(tempFilesBefore.length);
      expect(content).toBe("{\"test\": \"data\"}");
    });

    it("should clean up temporary files on stream error", async () => {
      // Check temp files before
      const tmpDir = os.tmpdir();
      const tempFilesBefore = fs.readdirSync(tmpDir);

      const result = await getFileStreamAndMetadata(`http://localhost:${testPort}/no-content-length`);

      // Trigger an error and wait for cleanup
      result.stream.destroy(new Error("Test error"));
      await waitForStreamCleanup(result.stream);

      // Check that temp files were cleaned up
      const tempFilesAfter = fs.readdirSync(tmpDir);
      expect(tempFilesAfter.length).toEqual(tempFilesBefore.length);
    });
  });
});
