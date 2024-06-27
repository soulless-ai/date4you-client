import { Page } from '../../../utils/Page.js';

export class News {
    constructor(socket) {
        this.socket = socket;
        this.container = document.querySelector('#app-news');
        this.userData = {};
        this.newsData = [];
    }

    render = async () => {
        this.userData = await this.fetchUserData();
        this.newsData = await this.fetchNewsData();

        new Page(this.socket, this.container).render(
            `
                <div class="app-main">
                    ${this.userData.isAdmin ? this.renderAdminForm() : ''}
                    <div id="newsFeed" class="news-feed">
                        <!-- News articles will be rendered here -->
                    </div>
                    <button id="exit">профиль</button>
                </div>
            `, {
            "#exit": this.exit,
            "#newsForm": this.userData.isAdmin ? this.handleFormSubmit : null,
        });

        // Render the list of news articles
        this.renderNewsFeed(this.newsData);

        new Page().addInputEventListeners();
    }

    fetchUserData = async () => {
        return {
            isAdmin: true,

        };
    }

    fetchNewsData = async () => {
        // Replace with actual API call to fetch news data
        return [
            {
                id: 1,
                title: "Community Event",
                content: "We are having a community event next weekend!",
                date: "2024-07-01",
                author: "Admin"
            },
            {
                id: 2,
                title: "New Features",
                content: "We have added new features to our platform.",
                date: "2024-06-25",
                author: "Admin"
            },
        ];
    }

    renderAdminForm = () => {
        return `
            <form id="newsForm" class="news-form">
                <label for="title">Title:</label>
                <input type="text" id="title" name="title" required>
                
                <label for="content">Content:</label>
                <textarea id="content" name="content" required></textarea>
                
                <button type="submit">Add News</button>
            </form>
        `;
    }

    renderNewsFeed = (newsData) => {
        const newsFeedContainer = document.querySelector("#newsFeed");
        newsFeedContainer.innerHTML = "";
        newsData.forEach(news => {
            const newsItem = document.createElement("div");
            newsItem.classList.add("news-item");
            newsItem.innerHTML = `
                <h2>${news.title}</h2>
                <p>${news.content}</p>
                <p class="news-meta">By ${news.author} on ${news.date}</p>
            `;
            newsFeedContainer.appendChild(newsItem);
        });
    }

    handleFormSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newNews = {
            title: formData.get('title'),
            content: formData.get('content'),
            date: new Date().toISOString().split('T')[0], // Current date
            author: this.userData.isAdmin ? "Admin" : "User" // Set author based on admin status
        };

        // Replace with actual API call to add news
        const success = await this.addNews(newNews);

        if (success) {
            this.newsData.push(newNews);
            this.renderNewsFeed(this.newsData);
            event.target.reset(); // Clear the form
            alert('News added successfully');
        } else {
            alert('Failed to add news');
        }
    }

    addNews = async (news) => {
        // Replace with actual API call to add news
        console.log('Adding news:', news);
        return true; // Simulate successful addition
    }

    exit = () => {
        new Page().hide([this.container]);
    }
}