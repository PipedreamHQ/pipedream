import dotenv from "dotenv";
import { CheerioWebBaseLoader } from "langchain/document_loaders";
import { Document } from "langchain/document";
import { LLMChain } from "langchain";
import { ChatVectorDBQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { Chroma } from "langchain/vectorstores";

dotenv.config();

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

const searchTemplate = "TypeScript or Node.js API docs";
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
]);

// TODO: convert this to use https://hwchase17.github.io/langchainjs/docs/modules/chat_models/examples/agent/

// Create the Q&A chain
const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  modelName: "gpt-4",
});

const chatPrompt = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(
    "You're a helpful assistant that generates Nodew.",
  ),
  HumanMessagePromptTemplate.fromTemplate("lang: Node.js\nVersion:14\n\n{prompt}"),
]);

const chain = ChatVectorDBQAChain.fromLLM(chatModel, vectorStore);

const response = await chain.call({
  input_language: "English",
  output_language: "French",
  prompt: "I love programming.",
});

// Create an agent that runs the above tools in sequence
// https://hwchase17.github.io/langchainjs/docs/modules/agents/overview

console.log(response);
