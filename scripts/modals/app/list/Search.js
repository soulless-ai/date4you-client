import { Page } from '../../../utils/Page.js';

export class Search {
    constructor(socket) {
        this.socket = socket;
        this.container = document.querySelector('#app-search');
    }

    render = async () => {
        new Page(this.socket, this.container).render(
            `
                <div class="app-main">
                    <form id="searchForm">
                        <label for="gender">Gender:</label>
                        <select id="gender" name="gender">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="both">Both</option>
                        </select>
                        
                        <label for="age">Age:</label>
                        <input type="number" id="age" name="age" min="18" max="100">
                        
                        <label for="location">Location:</label>
                        <select id="location" name="location">
                            <option value="nearby">Nearby</option>
                            <option value="city">Specific City</option>
                        </select>
                        
                        <input type="text" id="city" name="city" placeholder="Enter city name" style="display: none;">
                        
                        <button type="submit">Search</button>
                    </form>
                    <div id="results"></div>
                    <button id="exit">Profile</button>
                </div>
            `, {
            "#searchForm": this.handleSearch,
            "#exit": this.exit,
            "#location": this.handleLocationChange,
        });
        new Page().addInputEventListeners();
    }

    handleLocationChange = () => {
        const locationSelect = document.querySelector("#location");
        const cityInput = document.querySelector("#city");
        if (locationSelect.value === "city") {
            cityInput.style.display = "block";
        } else {
            cityInput.style.display = "none";
        }
    }

    handleSearch = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const searchParams = {
            gender: formData.get('gender'),
            age: formData.get('age'),
            location: formData.get('location'),
            city: formData.get('city'),
        };

        const results = await this.fetchSearchResults(searchParams);
        this.renderResults(results);
    }

    fetchSearchResults = async (searchParams) => {
        // Replace with actual API call
        return [
            {
                name: "John Doe",
                age: 25,
                zodiac: "Aquarius",
                instagram: "johndoe",
                photo: "path/to/photo.jpg",
            },
            {
                name: "Jane Smith",
                age: 30,
                zodiac: "Gemini",
                instagram: "janesmith",
                photo: "path/to/photo2.jpg",
            },
        ];
    }

    renderResults = (results) => {
        const resultsContainer = document.querySelector("#results");
        resultsContainer.innerHTML = "";
        results.forEach(result => {
            const resultItem = document.createElement("div");
            resultItem.classList.add("result-item");
            resultItem.innerHTML = `
                <img src="${result.photo}" alt="${result.name}">
                <p>${result.name}, ${result.age}</p>
                <p>${result.zodiac}</p>
                <p><a href="https://instagram.com/${result.instagram}">${result.instagram}</a></p>
            `;
            resultsContainer.appendChild(resultItem);
        });
    }

    exit = () => {
        new Page().hide([this.container]);
    }
}