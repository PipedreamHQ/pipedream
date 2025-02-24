import { promises as fs } from "fs";
import {
  dirname, join, relative, basename,
} from "path";
import chalk from "chalk";

// Convert header text to anchor link format
function headerToAnchor(headerText) {
  // First remove any Markdown links - replace [text](url) with just text
  const textWithoutLinks = headerText.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  return textWithoutLinks
    .toLowerCase()
    // Remove backticks which are just formatting
    .replace(/`/g, "")
    // Keep underscores but remove other special characters
    .replace(/[^a-z0-9_\s-]/g, "")
    .trim()
    // Convert spaces to hyphens
    .replace(/\s+/g, "-");
}

// Convert relative link to absolute path
function resolveRelativeLink(relativeLink, currentFilePath) {
  // If it's just an anchor link (#something), keep it relative to current file
  if (relativeLink.startsWith("#")) {
    const basePath = "/" + relative("pages", currentFilePath).replace(/\.mdx$/, "");
    return `${basePath}${relativeLink}`;
  }

  const dirPath = dirname(currentFilePath);
  const absolutePath = join(dirPath, relativeLink);
  return "/" + relative("pages", absolutePath);
}

// Normalize path handling
function normalizePath(path) {
  // Special case: root path
  if (path === "/") return "/";

  // Remove trailing slash unless it's the root
  if (path.endsWith("/") && path !== "/") {
    path = path.slice(0, -1);
  }
  return path;
}

// Find all MDX files recursively
async function findMdxFiles(dir) {
  const files = await fs.readdir(dir, {
    withFileTypes: true,
  });
  const mdxFiles = [];

  for (const file of files) {
    const filePath = join(dir, file.name);
    if (file.isDirectory()) {
      mdxFiles.push(...await findMdxFiles(filePath));
    } else if (file.name.endsWith(".mdx")) {
      mdxFiles.push(filePath);
    }
  }

  return mdxFiles;
}

// Extract links and their line numbers from MDX content
function extractLinks(content, filePath) {
  const links = [];
  const lines = content.split("\n");
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  lines.forEach((line, index) => {
    let match;
    while ((match = linkRegex.exec(line)) !== null) {
      const [
        , , link,
      ] = match;
      // Only process internal links
      if (link.startsWith("/") || link.startsWith("#") || !link.includes("://")) {
        let normalizedLink;
        if (link.startsWith("#")) {
          // For same-file anchors, we'll check both with and without the file path
          const basePath = "/" + relative("pages", filePath).replace(/\.mdx$/, "");
          normalizedLink = `${basePath}${link}`;
        } else {
          normalizedLink = link.startsWith("/")
            ? link
            : resolveRelativeLink(link, filePath);
        }
        links.push({
          originalLink: link,
          link: normalizedLink,
          lineNumber: index + 1,
        });
      }
    }
  });

  return links;
}

// Extract valid anchors from MDX content
function extractAnchors(content, filePath) {
  const anchors = new Set();
  const lines = content.split("\n");
  const headerRegex = /^#{1,6}\s+(.+)$/;

  // Calculate the base path for this file
  const relativePath = relative("pages", filePath);
  const basePath = "/" + relativePath.replace(/\.mdx$/, "");
  const baseDir = dirname(basePath);

  // For basePath /core/workflows/code/nodejs.mdx -> /core/workflows/code/nodejs
  const normalizedBasePath = normalizePath(basePath);
  anchors.add(normalizedBasePath.toLowerCase());

  // For index files, also add the directory path
  const isIndexFile = basename(filePath) === "index.mdx";
  if (isIndexFile) {
    const dirPath = baseDir === "."
      ? "/"
      : baseDir;
    anchors.add(dirPath.toLowerCase());
  }

  // Process all headers in the file
  lines.forEach((line) => {
    const match = line.match(headerRegex);
    if (match) {
      const headerText = match[1].trim();
      const anchor = headerToAnchor(headerText);

      // For headers, we need to track:
      // 1. Simple #anchor for same-file references
      anchors.add(`#${anchor}`.toLowerCase());

      // 2. Full path versions for cross-file references
      const anchorPaths = [
        `${normalizedBasePath}#${anchor}`,
        `${normalizedBasePath}/#${anchor}`,
      ];

      // For index files, also add anchors at the directory level
      if (isIndexFile) {
        const dirPath = baseDir === "."
          ? "/"
          : baseDir;
        anchorPaths.push(
          `${dirPath}#${anchor}`,
          `${dirPath}/#${anchor}`,
        );
      }

      // Add all variants to our set of valid anchors
      anchorPaths.forEach((path) => {
        anchors.add(path.toLowerCase());
      });
    }
  });

  if (process.env.DEBUG) {
    console.log(`File: ${filePath}`);
    console.log("Valid anchors:", Array.from(anchors));
  }

  return anchors;
}

// Try to find MDX file in direct or index format
async function findMdxFile(basePath) {
  basePath = normalizePath(basePath);

  // Try direct .mdx file first
  const directPath = join("pages", basePath + ".mdx");
  try {
    await fs.access(directPath);
    return directPath;
  } catch (err) {
    // Then try index.mdx
    const indexPath = join("pages", basePath, "index.mdx");
    try {
      await fs.access(indexPath);
      return indexPath;
    } catch (err) {
      return null;
    }
  }
}

async function main() {
  try {
    const mdxFiles = await findMdxFiles("pages");
    const linkMap = new Map();
    const validAnchors = new Set();
    const fileAnchorsMap = new Map(); // Track anchors by file

    // First pass: collect all links and generate valid anchors
    console.log("Processing MDX files...");
    for (const filePath of mdxFiles) {
      const content = await fs.readFile(filePath, "utf8");

      // Extract and store links
      const links = extractLinks(content, filePath);
      if (links.length > 0) {
        linkMap.set(filePath, links);
      }

      // Extract and store anchors
      const fileAnchors = extractAnchors(content, filePath);
      fileAnchorsMap.set(filePath, fileAnchors);
      for (const anchor of fileAnchors) {
        validAnchors.add(anchor);
      }
    }

    // Second pass: validate all links
    let brokenLinksFound = false;

    for (const [
      file,
      links,
    ] of linkMap) {
      // Get anchors for the current file
      const currentFileAnchors = fileAnchorsMap.get(file);

      for (const {
        originalLink, link, lineNumber,
      } of links) {
        if (originalLink.startsWith("#")) {
          // For same-file anchors, check both the simple #anchor and the full path
          const anchorExists = currentFileAnchors.has(originalLink.toLowerCase());
          if (!anchorExists) {
            brokenLinksFound = true;
            console.log(
              chalk.red("✗"),
              `${chalk.yellow(file)}:${chalk.cyan(lineNumber)}`,
              `Broken link: ${chalk.red(originalLink)} (anchor not found)`,
            );
          }
          continue;
        }

        // Split link into path and anchor parts
        const [
          path,
          anchor,
        ] = link.split("#");
        const normalizedPath = normalizePath(path);

        // First verify the file exists
        const targetFile = await findMdxFile(normalizedPath);
        if (!targetFile && anchor) {
          brokenLinksFound = true;
          console.log(
            chalk.red("✗"),
            `${chalk.yellow(file)}:${chalk.cyan(lineNumber)}`,
            `Broken link: ${chalk.red(link)} (file not found)`,
          );
          continue;
        }

        // Then check anchor if present
        if (anchor) {
          // Generate all possible variants of how this anchor might appear
          const variations = [
            `${normalizedPath}#${anchor}`,
            `${normalizedPath}/#${anchor}`,
            // For index files, also check directory-level anchors
            basename(targetFile) === "index.mdx"
              ? `${dirname(normalizedPath)}#${anchor}`
              : null,
            basename(targetFile) === "index.mdx"
              ? `${dirname(normalizedPath)}/#${anchor}`
              : null,
          ].filter(Boolean).map((v) => v.toLowerCase());

          if (process.env.DEBUG) {
            console.log("\nChecking link:", link);
            console.log("Checking variations:", variations);
            console.log("Against anchors:", Array.from(validAnchors));
          }

          const anchorExists = variations.some((v) => validAnchors.has(v));

          if (!anchorExists) {
            brokenLinksFound = true;
            console.log(
              chalk.red("✗"),
              `${chalk.yellow(file)}:${chalk.cyan(lineNumber)}`,
              `Broken link: ${chalk.red(originalLink)} (anchor not found)`,
            );
          }
        }
      }
    }

    if (brokenLinksFound) {
      console.log(chalk.red("\n✗ Broken links found!"));
      process.exit(1);
    }
    console.log(chalk.green("\n✓ All links are valid!"));
  } catch (error) {
    console.error(chalk.red("Error:"), error.message);
    process.exit(1);
  }
}

main();
