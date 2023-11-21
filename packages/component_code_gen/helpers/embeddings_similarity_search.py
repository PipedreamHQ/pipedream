from config.config import config
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import requests


def get_embedding(text):
    if config["openai_api_type"] == "azure":
        url = f"{config['azure']['api_base']}/openai/deployments/{config['azure']['deployment_name']}/embeddings"
        api_key = config["azure"]["api_key"]
    else:
        url = "https://api.openai.com/v1/embeddings"
        api_key = config["openai"]["api_key"]

    headers = {
        "Authorization": f"Bearer {api_key}",
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


def split_document(document, chunk_size=1000):
    return [document[i:i+chunk_size] for i in range(0, len(document), chunk_size)]


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
