
import type { PostData } from "./api";

const postContainer = document.getElementById('postContainer') as HTMLDivElement;
const loader = document.getElementById('loader') as HTMLDivElement; 

export const displayPosts = (posts: Array<PostData>) => {
    if (!postContainer) {
        console.error("Post container element is not available in the DOM.");
        return;
    }

    // Show loader while posts are loading
    if (loader) {
        loader.style.display = 'block'; // Show loader
    }

    postContainer.innerHTML = '';
    posts.sort((a, b) => b.id - a.id);

    posts.forEach((post) => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.setAttribute('data-id', post.id.toString());
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p class = "post-description">${post.body}</p>
            <div class="post-btn">
                <button class="edit-btn" data-id="${post.id}">Edit</button>
                <button class="delete-btn" data-id="${post.id}">Delete</button>
            </div>
        `;
        postContainer.appendChild(postElement);
    });

    // Hide loader after posts are displayed
    if (loader) {
        loader.style.display = 'none'; // Hide loader
    }
};
