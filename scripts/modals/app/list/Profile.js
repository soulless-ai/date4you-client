import { Page } from '../../../utils/Page.js';

export class Profile {
    constructor(socket) {
        this.socket = socket;
        this.container = document.querySelector('#app-profile');
        this.userData = {}; // This should be populated with actual user data
    }

    render = async () => {
        this.userData = await this.fetchUserData(); // Fetch user data
        new Page(this.socket, this.container).render(
            `
                <div class="app-main">
                    <div class="profile-photo">
                        <img src="${this.userData.photo}" alt="User Photo">
                    </div>
                    <form id="profileForm">
                        <label for="name">Name:</label>
                        <input type="text" id="name" name="name" value="${this.userData.name}">
                        
                        <label for="nickname">Nickname:</label>
                        <input type="text" id="nickname" name="nickname" value="${this.userData.nickname}">
                        
                        <label for="about">About:</label>
                        <textarea id="about" name="about">${this.userData.about}</textarea>
                        
                        <label for="audioCallEnabled">Allow Audio Calls:</label>
                        <input type="checkbox" id="audioCallEnabled" name="audioCallEnabled" ${this.userData.audioCallEnabled ? 'checked' : ''}>
                        
                        <label for="videoCallEnabled">Allow Video Calls:</label>
                        <input type="checkbox" id="videoCallEnabled" name="videoCallEnabled" ${this.userData.videoCallEnabled ? 'checked' : ''}>
                        
                        <button type="submit">Save</button>
                    </form>
                    <button id="exit">Exit</button>
                </div>
            `, {
            "#profileForm": this.handleFormSubmit,
            "#exit": this.exit,
        });
        new Page().addInputEventListeners();
    }

    fetchUserData = async () => {
        // Replace with actual API call to fetch user data
        return {
            photo: "path/to/user/photo.jpg",
            name: "John Doe",
            nickname: "johndoe",
            about: "This is a sample bio.",
            audioCallEnabled: true,
            videoCallEnabled: false,
        };
    }

    handleFormSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const updatedData = {
            name: formData.get('name'),
            nickname: formData.get('nickname'),
            about: formData.get('about'),
            audioCallEnabled: formData.get('audioCallEnabled') === 'on',
            videoCallEnabled: formData.get('videoCallEnabled') === 'on',
        };

        // Replace with actual API call to update user data
        const success = await this.updateUserData(updatedData);
        
        if (success) {
            alert('Profile updated successfully');
        } else {
            alert('Failed to update profile');
        }
    }

    updateUserData = async (updatedData) => {
        // Replace with actual API call to update user data
        console.log('Updating user data with:', updatedData);
        return true; // Simulate successful update
    }

    exit = () => {
        new Page().hide([this.container]);
    }
}