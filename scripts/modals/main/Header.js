import { Page } from "../../utils/Page.js";

export class Header {
    constructor() {
        this.container = document.querySelector('header');
    }

    render = async () => {
        new Page(null, this.container).render(
            `
                <div class="header-container">
                    <h1>Date4You</h1>
                    <ul>
                        <li>Главная</li>
                        <li>О нас</li>
                    </ul>
                </div>
            `
        )
    }
    getContainer = () => {
        return this.container;
    }
}