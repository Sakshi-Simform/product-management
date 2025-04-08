const API_URL = 'https://dummyjson.com/posts';
const LIMIT = 30;
let skip = 0;
let hasMore = true;
let isFetching = false;

export interface PostData {
    id: number;
    title: string;
    body: string;
}

export const fetchPosts = async (): Promise<Array<PostData>> => {
    try {
        if (!hasMore || isFetching) return [];
        isFetching = true;

        const response = await fetch(`${API_URL}?limit=${LIMIT}&skip=${skip}`);
        const data = await response.json();

        if (data.posts.length < LIMIT) hasMore = false;
        skip += LIMIT;
        isFetching = false;

        return data.posts;
    } catch (error) {
        isFetching = false;
        console.error("Error fetching posts:", error); 
    }
};


// Update post in API
export const updatePost = async (post: PostData) => {
    return fetch(`${API_URL}/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
    });
};

// Delete post from API
export const deletePost = async (id: number) => {
    return fetch(`${API_URL}/${id}`, { method: 'DELETE' });
};