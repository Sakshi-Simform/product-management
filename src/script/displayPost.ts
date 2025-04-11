import type { PostData } from "./api";

const postContainer = document.getElementById('postContainer') as HTMLDivElement;

export const displayPosts = (posts: Array<PostData>) => {
    if (!postContainer) {
        console.error("Post container element is not available in the DOM.");
        return;
    }

    postContainer.innerHTML = ''; 

    posts.sort((a, b) => b.id - a.id);

    posts.forEach((post) => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.dataset.id = post.id.toString();

        const title = document.createElement('span');
        title.className = 'post-title';
        title.textContent = post.title;

        const description = document.createElement('p');
        description.className = 'post-description';
        description.textContent = post.body;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'post-btn';

        const editButton = document.createElement('button');
        editButton.className = 'edit-btn';
        editButton.dataset.id = post.id.toString();
        editButton.textContent = 'Edit';

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.dataset.id = post.id.toString();
        deleteButton.textContent = 'Delete';

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        postElement.appendChild(title);
        postElement.appendChild(description);
        postElement.appendChild(buttonContainer);

        postContainer.appendChild(postElement);
    });
};