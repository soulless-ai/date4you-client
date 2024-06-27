import { Page } from "../../utils/Page.js";
import { News } from "../app/list/News.js";
import { Footer } from "../app/Footer.js";

export class App {
    constructor(socket) {
        this.socket = socket;
        this.container = document.querySelector('#app');
    }

    render() {
        this.container.classList.remove('hide');
        new News(this.socket).render();
        new Footer(this.socket).render();
    }
}