import faiss
import numpy as np

dimension = 512
index = faiss.IndexFlatL2(dimension)

metadata = []

def add_vector(vector, data):
    vec = np.array(vector).astype("float32")
    index.add(np.expand_dims(vec, axis=0))
    metadata.append(data)

def search_vector(vector, k=5, user_id=None):
    total = len(metadata)
    if total == 0:
        return []

    vec = np.array(vector).astype("float32")
    search_k = total if user_id else min(k, total)
    _, indices = index.search(np.expand_dims(vec, axis=0), search_k)

    results = []
    for idx in indices[0]:
        if idx < 0 or idx >= total:
            continue
        row = metadata[idx]
        if user_id and row.get("user_id") != user_id:
            continue
        results.append(row)
        if len(results) >= k:
            break
    return results
