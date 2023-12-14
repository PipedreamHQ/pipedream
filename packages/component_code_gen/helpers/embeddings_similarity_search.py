import requests
import numpy as np
from config.config import config
from sklearn.metrics.pairwise import cosine_similarity
from langchain.text_splitter import MarkdownHeaderTextSplitter
from langchain.text_splitter import RecursiveCharacterTextSplitter


def get_embedding(text):
    if config["openai_api_type"] == "azure":
        url = f"{config['azure']['api_base']}/openai/deployments/{config['azure']['embeddings_deployment_name']}/embeddings"
        headers = {
            "api-key": config["azure"]["api_key"],
        }
        params = {
            "api-version": config["azure"]["api_version"],
        }
        data = {
            "input": text,
            "model": "text-embedding-ada-002",
        }
        response = requests.post(url, headers=headers, params=params, json=data)
    else:
        url = "https://api.openai.com/v1/embeddings"
        headers = {
            "Authorization": f'Bearer {config["openai"]["api_key"]}',
        }
        data = {
            "input": text,
            "model": "text-embedding-ada-002",
        }
        response = requests.post(url, headers=headers, json=data)

    if not response.ok:
        raise Exception(
            f"OpenAI exception: {response.status_code} - {response.text}")

    embedding = response.json()["data"][0]["embedding"]
    return np.asarray(embedding).reshape(1, -1)


def split_document(document, max_size=8000):
    markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=[
        ("#", "Header 1"),
        ("##", "Header 2"),
        ("###", "Header 3"),
    ])
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=max_size) # openai embedding limits to 8k

    document_splits = []
    md_header_splits = markdown_splitter.split_text(document)
    char_splits = text_splitter.split_documents(md_header_splits)

    for chunk in char_splits:
        headers = " -> ".join(chunk.metadata.values())
        document_splits.append(f"{headers}\n\n{chunk.page_content}")

    return document_splits


def store_embeddings(chunks):
    return {i: get_embedding(chunk) for i, chunk in enumerate(chunks)}


def calculate_similarity(query_embedding, stored_embeddings):
    similarities = {i: cosine_similarity(query_embedding, embedding)[0][0]
                    for i, embedding in stored_embeddings.items()}
    return similarities


def get_top_n_results(query, stored_embeddings, top_n=5):
    query_embedding = get_embedding(query)
    similarities = calculate_similarity(query_embedding, stored_embeddings)
    sorted_similarities = sorted(
        similarities.items(), key=lambda x: x[1], reverse=True)
    return sorted_similarities[:top_n]


def get_relevant_docs(query, document):
    chunks = split_document(document)
    embeddings = store_embeddings(chunks)
    top_n_results = get_top_n_results(query, embeddings)
    relevant_docs = [chunks[index]
                     for index in [x[0] for x in top_n_results]]
    return "\n\n".join(relevant_docs)
