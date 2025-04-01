// import { fetchPosts, updatePostAPI, deletePostAPI, Post  } from './api.ts';
// import { displayPosts } from './ui.ts';
// import { debounce } from './debounce.ts';
// import {
//     getLocalPosts,
//     storePostsLocally,
//     updateLocalPost,
//     deleteLocalPost,
// } from './storage.ts';

// const titleInput = document.getElementById('title') as HTMLInputElement;
// const bodyInput = document.getElementById('body') as HTMLInputElement;
// const saveButton = document.getElementById('savePost') as HTMLButtonElement;
// const postContainer = document.getElementById('postContainer') as HTMLDivElement;
// const searchInput = document.getElementById('searchInput') as HTMLInputElement; 

// let editingPostId: number | null = null;

// let isFetching = false;
// let hasMore = true;
// let skip = 0;

// // Load posts from localStorage or fetch from API
// const loadPosts = async () => {
//     const localPosts = getLocalPosts();
//     if (localPosts.length > 0) {
//         displayPosts(localPosts);
//     } else {
//         const posts = await fetchPosts();
//         storePostsLocally(posts);
//         displayPosts(posts);
//     }
// };

// // Infinite scroll function
// const loadMorePostsOnScroll = async () => {
//     const scrollPosition = window.scrollY + window.innerHeight;
//     const pageHeight = document.documentElement.scrollHeight;

//     if (scrollPosition >= pageHeight - 100) {
//         const newPosts = await fetchPosts();
//         if (newPosts.length > 0) {
//             displayPosts(getLocalPosts());
//         }
//     }
// };

// // Add or update post
// const addOrUpdatePost = async () => {
//     const title = titleInput.value.trim();
//     const body = bodyInput.value.trim();
//     if (!title || !body) return alert('Please enter title and description');

//     let posts = getLocalPosts();
//     let postData: Post;

//     if (editingPostId) {
//         postData = { id: editingPostId, title, body };
//         updateLocalPost(postData);
//         await updatePostAPI(postData);
//         editingPostId = null;
//     } else {
//         postData = { id: Date.now(), title, body };
//         posts = [postData, ...posts];
//         storePostsLocally(posts);
//     }

//     titleInput.value = '';
//     bodyInput.value = '';
//     displayPosts(getLocalPosts());
// };

// // Event listener for Edit & Delete actions
// postContainer.addEventListener('click', async (event) => {
//     const target = event.target as HTMLElement;
//     const postId = target.getAttribute('data-id');
//     if (!postId) return;

//     if (target.classList.contains('edit-btn')) {
//         const post = getLocalPosts().find((p) => p.id === Number(postId));
//         if (post) {
//             editingPostId = post.id;
//             titleInput.value = post.title;
//             bodyInput.value = post.body;
//         }
//     }

//     if (target.classList.contains('delete-btn')) {
//         deleteLocalPost(Number(postId));
//         await deletePostAPI(Number(postId));
//         displayPosts(getLocalPosts());
//     }
// });

// // Search function to filter posts
// const searchPosts = () => {
//     console.log("hello")
//     const query = searchInput.value.toLowerCase().trim();
//     const allPosts = getLocalPosts(); // Get all posts from local storage

//     const filteredPosts = allPosts.filter(
//         (post) =>
//             post.title.toLowerCase().includes(query) ||
//             post.body.toLowerCase().includes(query)
//     );

//     displayPosts(filteredPosts);
// };

// const debouncedSearchPosts = debounce(searchPosts, 5000);
// searchInput.addEventListener('input', debouncedSearchPosts);


// // Event listener for search input

// window.onload = loadPosts;
// saveButton.addEventListener('click', addOrUpdatePost);
// window.addEventListener('scroll', loadMorePostsOnScroll);


import { fetchPosts, updatePostAPI, deletePostAPI, Post } from './api.ts';
import { displayPosts } from './ui.ts';
import { debounce } from './debounce.ts';
import {
    getLocalPosts,
    storePostsLocally,
    updateLocalPost,
    deleteLocalPost,
} from './storage.ts';

const titleInput = document.getElementById('title') as HTMLInputElement;
const bodyInput = document.getElementById('body') as HTMLInputElement;
const saveButton = document.getElementById('savePost') as HTMLButtonElement;
const postContainer = document.getElementById('postContainer') as HTMLDivElement;
const searchInput = document.getElementById('searchInput') as HTMLInputElement;

let editingPostId: number | null = null;

let isFetching = false;
let hasMore = true;
let skip = 0;

// Load posts from localStorage or fetch from API
const loadPosts = async () => {
    const localPosts = getLocalPosts();
    if (localPosts.length > 0) {
        displayPosts(localPosts);
    } else {
        const posts = await fetchPosts();
        storePostsLocally(posts);
        displayPosts(posts);
    }
};

// Infinite scroll function
const loadMorePostsOnScroll = async () => {
    if (isFetching || !hasMore) return;

    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 100) {
        isFetching = true;

        const newPosts = await fetchPosts(); // Fetch next set of posts
        if (newPosts.length > 0) {
            storePostsLocally(newPosts); // Store new posts locally
            displayPosts(getLocalPosts()); // Display updated posts
        }

        if (newPosts.length < 30) {
            hasMore = false; // No more posts available from the API
        }

        isFetching = false; // Allow further requests
    }
};

// Add or update post
const addOrUpdatePost = async () => {
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();
    if (!title || !body) return alert('Please enter title and description');

    let posts = getLocalPosts();
    let postData: Post;

    if (editingPostId) {
        postData = { id: editingPostId, title, body };
        updateLocalPost(postData);
        await updatePostAPI(postData);
        editingPostId = null;
    } else {
        postData = { id: Date.now(), title, body };
        posts = [postData, ...posts];
        storePostsLocally(posts);
    }

    titleInput.value = '';
    bodyInput.value = '';
    displayPosts(getLocalPosts());
};

// Event listener for Edit & Delete actions
postContainer.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement;
    const postId = target.getAttribute('data-id');
    if (!postId) return;

    if (target.classList.contains('edit-btn')) {
        const post = getLocalPosts().find((p) => p.id === Number(postId));
        if (post) {
            editingPostId = post.id;
            titleInput.value = post.title;
            bodyInput.value = post.body;
        }
    }

    if (target.classList.contains('delete-btn')) {
        deleteLocalPost(Number(postId));
        await deletePostAPI(Number(postId));
        displayPosts(getLocalPosts());
    }
});

// Search function to filter posts
const searchPosts = () => {
    console.log("Searching posts...");
    const query = searchInput.value.toLowerCase().trim();
    const allPosts = getLocalPosts(); // Get all posts from local storage

    const filteredPosts = allPosts.filter(
        (post) =>
            post.title.toLowerCase().includes(query) ||
            post.body.toLowerCase().includes(query)
    );

    displayPosts(filteredPosts);
};

const debouncedSearchPosts = debounce(searchPosts, 500);
searchInput.addEventListener('input', debouncedSearchPosts);

// Event listener for search input

window.onload = loadPosts;
saveButton.addEventListener('click', addOrUpdatePost);
window.addEventListener('scroll', loadMorePostsOnScroll);
