import { ValidateForm } from './formvalidation';
import { fetchPosts, updatePost, deletePost, PostData } from './api';
import { displayPosts } from './displaypost';
import { debounce } from './debounce';
import {
    getLocalPosts,
    storePostsLocally,
    updateLocalPost,
    deleteLocalPost,
} from './storage';

const titleInput = document.getElementById('title') as HTMLInputElement;
const bodyInput = document.getElementById('description') as HTMLTextAreaElement;
const saveButton = document.getElementById('savePost') as HTMLButtonElement;
const postContainer = document.getElementById('postContainer') as HTMLDivElement;
const searchInput = document.getElementById('searchInput') as HTMLInputElement;

let editingPostId: number | null = null;
let isFetching = false;
let hasMore = true;

// Function to handle form validation for input fields
const formHandler = () => {
    const handleInput = (
        inputId: string,
        validator: (value: string) => string,
        errorType: string
    ) => {
        const inputElement = document.getElementById(inputId) as HTMLInputElement;
        if (inputElement) {
            inputElement.addEventListener('input', (e) => {
                const value = e.target instanceof HTMLInputElement ? e.target.value : '';
                const errorMessage = validator(value);
                const formValidation = new ValidateForm();

                if (errorMessage) {
                    formValidation.showError(errorType, errorMessage);
                } else {
                    formValidation.clearError(errorType);
                }
            });
        }
    };

    const formValidation = new ValidateForm();
    handleInput('title', formValidation.validateTitle.bind(formValidation), 'title');
    handleInput('description', formValidation.validateDescription.bind(formValidation), 'description');
};

// Load posts from localStorage or API
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

// Infinite scroll logic
const loadMorePostsOnScroll = async () => {
    if (isFetching || !hasMore) return;

    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    const pageValue = 150;
    const minimumPost = 30;

    if (scrollPosition >= pageHeight - pageValue) {
        isFetching = true;
        const newPosts = await fetchPosts(); // Fetch next set of posts
        if (newPosts.length > 0) {
            storePostsLocally(newPosts);
            displayPosts(getLocalPosts());
        }

        if (newPosts.length < minimumPost) {
            hasMore = false;
        }

        isFetching = false;
    }
};

// Add or update a post
const addOrUpdatePost = async () => {
    const formValidation = new ValidateForm();
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();
    const titleError = document.getElementById('titleError') as HTMLParagraphElement;
    const descriptionError = document.getElementById('descriptionError') as HTMLParagraphElement;

    // Validate title and body fields
   
    const titleValidationMessage = formValidation.validateTitle(title);
    const descriptionValidationMessage = formValidation.validateDescription(body);

    if (titleValidationMessage) {
        formValidation.showError('title', titleValidationMessage);
        return;
    }
    if (descriptionValidationMessage) {
        formValidation.showError('body', descriptionValidationMessage);
        
    }

    let posts = getLocalPosts();
    let postData: PostData;

    if (editingPostId) {
        postData = { id: editingPostId, title, body };
        updateLocalPost(postData);
        await updatePost(postData);
        editingPostId = null;
    } else {
        postData = { id: Date.now(), title, body };
        posts = [postData, ...posts];
        storePostsLocally(posts);
    }

    // Clear fields after submission
    titleInput.value = '';
    bodyInput.value = '';
    titleError.textContent = '';
    descriptionError.textContent = '';
    displayPosts(getLocalPosts());
};

// Event listener for edit and delete buttons
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
        await deletePost(Number(postId));
        displayPosts(getLocalPosts());
        alert('Are you sure you want to delete');
    }
});

// Search function to filter posts
const searchPosts = () => {
    const query = searchInput.value.toLowerCase().trim();
    const allPosts = getLocalPosts();

    const filteredPosts = allPosts.filter(
        (post) =>
            post.title.toLowerCase().includes(query) ||
            post.body.toLowerCase().includes(query)
    );

    postContainer.innerHTML = '';

    if (filteredPosts.length === 0) {
        postContainer.innerHTML = `<p class="post-message">No posts available for the word: "${query}"</p>`;
    } else {
        displayPosts(filteredPosts);
    }
};

// Debounced search to limit API calls
const debouncedSearchPosts = debounce(searchPosts, 500);
searchInput.addEventListener('input', debouncedSearchPosts);

// Initialize page
window.onload = () => {
    formHandler();
    loadPosts();
};
saveButton.addEventListener('click', addOrUpdatePost);
window.addEventListener('scroll', loadMorePostsOnScroll);