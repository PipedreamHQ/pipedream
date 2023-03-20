import dotenv from "dotenv";
import fetch from "node-fetch";
import ora from "ora";
import * as readline from "readline";
import ts from "typescript";

import { LLMChain } from "langchain";
import { ChatOpenAI } from "langchain/chat_models";
import { Document } from "langchain/document";
import { CheerioWebBaseLoader } from "langchain/document_loaders";
import { OpenAIEmbeddings } from "langchain/embeddings";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Chroma } from "langchain/vectorstores";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getUserInput(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
      rl.close();
    });
  });
}

function getTypeScriptDiagnostics(code: string): readonly ts.Diagnostic[] {
  const options: ts.CompilerOptions = {
    noEmit: true,
  }; // Prevent output generation

  const compilerHost: ts.CompilerHost = ts.createCompilerHost(options);
  compilerHost.getSourceFile = (fileName) => {
    if (fileName === "temp.ts") {
      return ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest, true);
    }
    return undefined;
  };

  const program = ts.createProgram([
    "temp.ts",
  ], options, compilerHost);
  const diagnostics = ts.getPreEmitDiagnostics(program);

  return diagnostics;
}

const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
const cseId = process.env.GOOGLE_CSE_ID;

async function fetchFirstSearchResult(query: string): Promise<string | null> {
  const apiUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cseId}&num=1`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      return data.items[0].link;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching search result:", error);
    return null;
  }
}

// Thanks to https://apis.guru/api-doc/#operation/listAPIs
// for providing the list of OpenAPI specs
type ApiGuruObject = {
    [key: string]: {
      added: string;
      preferred: string;
      versions: {
        [version: string]: {
          added?: string;
          info?: {
            title: string;
            version: string;
            "x-apiClientRegistration": {
              url: string;
            };
            "x-logo": {
              url: string;
            };
            "x-origin": {
              format: string;
              url: string;
              version: string;
            };
            "x-preferred": boolean;
            "x-providerName": string;
            "x-serviceName": string;
          };
          swaggerUrl?: string;
          swaggerYamlUrl?: string;
          updated?: string;
        };
      };
    };
  };

function extractPreferredSwaggerUrls(data: ApiGuruObject): { name: string; swaggerUrl: string; }[] {
  const result: { name: string; swaggerUrl: string; }[] = [];

  for (const [
    name,
    api,
  ] of Object.entries(data)) {
    const preferredVersion = api.preferred;
    const preferredVersionData = api.versions[preferredVersion];

    if (preferredVersionData && preferredVersionData.swaggerUrl) {
      result.push({
        name,
        swaggerUrl: preferredVersionData.swaggerUrl,
      });
    }
  }

  return result;
}

/* const searchTemplate = "TypeScript or Node.js API docs";
const searchQuery = `List all Stripe invoices ${searchTemplate}`;
const firstResultUrl = await fetchFirstSearchResult(searchQuery);
if (!firstResultUrl) {
  console.error("No search results found");
  process.exit(1);
}
console.log(`First search result for "${searchQuery}":`, firstResultUrl);

// Fetch the HTML of the first result
const loader = new CheerioWebBaseLoader(
  firstResultUrl,
);
const docs = await loader.load();

// Need to split the docs for large webpages
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 7500,
});
const docsChunks = await splitter.splitDocuments(docs);

// Get all the OpenAPI specs of all of our APIs
// TODO: can we use https://github.com/hwchase17/langchainjs/blob/main/langchain/src/agents/agent_toolkits/openapi/openapi.ts ?
const openAPISpecs = await fetch("https://api.apis.guru/v2/list.json");
const openAPISpecsData = await openAPISpecs.json();
const preferredSwaggerUrls = extractPreferredSwaggerUrls(openAPISpecsData);
const swaggerChunks = [];
for (const {
  name, swaggerUrl,
} of preferredSwaggerUrls) {
  console.log(name, swaggerUrl);
  const spec = await fetch(swaggerUrl);
  const specData = await spec.json();
  const specChunks = await splitter.splitDocuments([
    new Document({
      pageContent: specData,
      metadata: {
        source: name,
      },
    }),
  ]);
  swaggerChunks.push(...specChunks);
}

// Create embeddings
const chroma = new Chroma(new OpenAIEmbeddings(),
  {
    collectionName: "api-docs-and-open-api-specs",
  });

await chroma.addDocuments([
  ...docsChunks,
  ...swaggerChunks,
]); */

const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  modelName: "gpt-4",
});

const chatPrompt = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(
    `lang: Node.js v14
output: Node.js code

You're a helpful assistant that generates Typescript (Node.js) code and ONLY TypeScript code, with no English text before or after.

You'll be asked to make API requests to many third-party services. The API key, OAuth token, or other required auth data should ALWAYS be referenced process.env.AUTH, no matter what the API key / token is called in the service's docs.

imports should be placed at the top of the file. Use ESM for all imports, not CommonJS.

Double-check the code against known TypeScript / Node.js examples you've been trained on, from examples in the context below, GitHub, and any other real code you find. Only return TypeScript code. DO NOT include any English text before or after the TypeScript code. DO NOT say something like "Here's an example..." to preface the code. DO NOT include the code in Markdown code blocks, or format it in any fancy way. Just show me the code.`,
  ),
  HumanMessagePromptTemplate.fromTemplate("lang: TypeScript (Node.js)\nNode Version:14\nmodule: esnext\n\n{text}"),
]);

const llmChain = new LLMChain({
  prompt: chatPrompt,
  llm: chatModel,
});

const text = await getUserInput("What do you want the component to do? " );

const spinner = ora("Fetching TypeScript code... ").start();
const response = await llmChain.call({
  text,
});
spinner.succeed("TypeScript code:");

const nodeCode = response.text;
console.log(`${nodeCode}\n\n`);

// Validate that the code is Node.js with a constitution chain
const diagnostics = getTypeScriptDiagnostics(nodeCode);
console.log("Diagnostics for validCode:");
diagnostics.forEach((diagnostic) => {
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
  console.log(`(${diagnostic.start}): ${message}`);
});
