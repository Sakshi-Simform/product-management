// const API_URL = 'https://dummyjson.com/posts';
// const LIMIT = 30;
// let skip = 0;
// let hasMore = true;
// let isFetching = false;

// export interface Post {
//     id: number;
//     title: string;
//     body: string;
// }

// // Fetch posts from API
// export const fetchPosts = async (): Promise<Post[]> => {
//     if (!hasMore || isFetching) return [];
//     isFetching = true;
//     const response = await fetch(`${API_URL}?limit=${LIMIT}&skip=${skip}`);
//     const data = await response.json();
//     if (data.posts.length < LIMIT) hasMore = false;
//     skip += LIMIT;
//     isFetching = false;
//     return data.posts;
// };

// const handleScroll = () => {
//     if (
//         window.innerHeight + window.scrollY >=
//         document.body.offsetHeight - 100
//     ) {
//         fetchPosts();
//     }
// };

// // Update post in API
// export const updatePostAPI = async (post: Post) => {
//     return fetch(`${API_URL}/${post.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(post),
//     });
// };

// // Delete post from API
// export const deletePostAPI = async (id: number) => {
//     return fetch(`${API_URL}/${id}`, { method: 'DELETE' });
// };

// window.addEventListener('scroll', handleScroll);


const API_URL = 'https://dummyjson.com/posts';
const LIMIT = 30;
let skip = 0;
let hasMore = true;
let isFetching = false;

export interface Post {
    id: number;
    title: string;
    body: string;
}

// Function to render posts to the page
const renderPosts = (posts: Post[]) => {
    const postContainer = document.getElementById('post-container')!;
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>
        `;
        postContainer.appendChild(postElement);
    });
};

// Fetch posts from API
export const fetchPosts = async (): Promise<void> => {
    if (!hasMore || isFetching) return;

    isFetching = true;
    try {
        const response = await fetch(`${API_URL}?limit=${LIMIT}&skip=${skip}`);
        const data = await response.json();

        if (data.posts.length < LIMIT) hasMore = false;

        skip += LIMIT;

        // Render posts when fetched
        renderPosts(data.posts);

    } catch (error) {
        console.error('Error fetching posts:', error);
    } finally {
        isFetching = false;
    }
};

// Handle scroll event to trigger fetching when near the bottom
const handleScroll = () => {
    if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
    ) {
        fetchPosts();
    }
};

// Update post in API
export const updatePostAPI = async (post: Post) => {
    return fetch(`${API_URL}/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
    });
};

// Delete post from API
export const deletePostAPI = async (id: number) => {
    return fetch(`${API_URL}/${id}`, { method: 'DELETE' });
};

// Initialize scroll listener and initial fetch
window.addEventListener('scroll', handleScroll);

// Initial fetch when the page loads
fetchPosts();
