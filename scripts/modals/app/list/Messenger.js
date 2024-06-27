import { Page } from '../../../utils/Page.js';

export class Messenger {
    constructor(socket) {
        this.socket = socket;
        this.container = document.querySelector('#app-messenger');
    }

    render = async () => {
        new Page(this.socket, this.container).render(
            `
                <div class="app-main">
                    <div id="chatList" class="chat-list">
                        <!-- Chats will be rendered here -->
                    </div>
                    <div id="chatWindow" class="chat-window">
                        <!-- Chat window will be rendered here -->
                    </div>
                    <button id="exit">
                        профиль
                    </button>
                </div>
            `, {
            "#exit": this.exit,
        });

        // Fetch and render the list of chats
        const chats = await this.fetchChats();
        this.renderChatList(chats);

        new Page().addInputEventListeners();
    }

    fetchChats = async () => {
        // Replace with actual API call to fetch chats
        return [
            {
                id: 1,
                name: "John Doe",
                lastMessage: "Hello!",
                photo: "path/to/photo.jpg",
                audioCallEnabled: true,
                videoCallEnabled: true,
            },
            {
                id: 2,
                name: "Jane Smith",
                lastMessage: "See you soon!",
                photo: "path/to/photo2.jpg",
                audioCallEnabled: true,
                videoCallEnabled: false,
            },
        ];
    }

    renderChatList = (chats) => {
        const chatListContainer = document.querySelector("#chatList");
        chatListContainer.innerHTML = "";
        chats.forEach(chat => {
            const chatItem = document.createElement("div");
            chatItem.classList.add("chat-item");
            chatItem.innerHTML = `
                <img src="${chat.photo}" alt="${chat.name}" class="chat-photo">
                <div class="chat-info">
                    <p class="chat-name">${chat.name}</p>
                    <p class="chat-last-message">${chat.lastMessage}</p>
                </div>
            `;
            chatItem.addEventListener("click", () => this.openChat(chat));
            chatListContainer.appendChild(chatItem);
        });
    }

    openChat = (chat) => {
        const chatWindow = document.querySelector("#chatWindow");
        chatWindow.innerHTML = `
            <div class="chat-header">
                <img src="${chat.photo}" alt="${chat.name}" class="chat-photo">
                <div class="chat-info">
                    <p class="chat-name">${chat.name}</p>
                </div>
                <div class="chat-actions">
                    ${chat.audioCallEnabled ? '<button id="audioCall">Audio Call</button>' : ''}
                    ${chat.videoCallEnabled ? '<button id="videoCall">Video Call</button>' : ''}
                </div>
            </div>
            <div class="chat-messages">
                <!-- Chat messages will be rendered here -->
            </div>
            <div class="chat-input">
                <input type="text" id="messageInput" placeholder="Type a message">
                <button id="sendMessage">Send</button>
            </div>
        `;

        if (chat.audioCallEnabled) {
            document.querySelector("#audioCall").addEventListener("click", () => this.audioCall(chat.id));
        }
        if (chat.videoCallEnabled) {
            document.querySelector("#videoCall").addEventListener("click", () => this.videoCall(chat.id));
        }
        document.querySelector("#sendMessage").addEventListener("click", () => this.sendMessage(chat.id));
    }

    audioCall = (chatId) => {
        console.log("Audio call initiated with chat ID:", chatId);
        // Implement audio call functionality
    }

    videoCall = (chatId) => {
        console.log("Video call initiated with chat ID:", chatId);
        // Implement video call functionality
    }

    sendMessage = (chatId) => {
        const messageInput = document.querySelector("#messageInput");
        const message = messageInput.value;
        if (message.trim() !== "") {
            console.log("Sending message to chat ID:", chatId, "Message:", message);
            messageInput.value = "";
            // Implement message sending functionality
        }
    }

    exit = () => {
        new Page().hide([this.container]);
    }
}