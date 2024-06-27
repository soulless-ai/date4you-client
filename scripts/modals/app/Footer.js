import { Page } from "../../utils/Page.js";
import { Messenger } from "./list/Messenger.js";
import { News } from "./list/News.js";
import { Profile } from "./list/Profile.js";
import { Search } from "./list/Search.js";

export class Footer {
    constructor(socket) {
        this.socket = socket;
        this.container = document.querySelector('#app-footer');
    }

    render = async () => {
        new Page(this.socket, this.container).render(
            `
                <button id="newsButton" class="active">
                    новости
                </button>
                <button id="searchButton">
                    ПОИСК
                </button>
                <button id="messengerButton">
                    мессенджер
                </button>
                <button id="profileButton">
                    профиль
                </button>
            `, {
            "#newsButton": this.handleButtonClick(this.getNewsPage, "#newsButton"),
            "#searchButton": this.handleButtonClick(this.getSearchPage, "#searchButton"),
            "#messengerButton": this.handleButtonClick(this.getMessengerPage, "#messengerButton"),
            "#profileButton": this.handleButtonClick(this.getProfilePage, "#profileButton")
        });
        new Page().addInputEventListeners();
    };

    handleButtonClick = (pageFunction, buttonID) => {
        return async () => {
            this.setActiveButton(buttonID);
            await pageFunction();
        };
    }

    setActiveButton = (buttonID) => {
        const buttons = this.container.querySelectorAll('button');
        buttons.forEach(button => button.classList.remove('active'));
        this.container.querySelector(buttonID).classList.add('active');
    }

    getNewsPage = async() => {
        this.hideAllSections();
        new News(this.socket).render();
    }

    getSearchPage = async() => {
        this.hideAllSections();
        new Search(this.socket).render();
    }

    getMessengerPage = async() => {
        this.hideAllSections();
        new Messenger(this.socket).render();
    }

    getProfilePage = async() => {
        this.hideAllSections();
        new Profile(this.socket).render();
    }

    hideAllSections = () => {
        new News().exit();
        new Search().exit();
        new Messenger().exit();
        new Profile().exit();
    }
}