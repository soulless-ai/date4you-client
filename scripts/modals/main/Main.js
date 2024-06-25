import { Page } from "../../utils/Page.js";

export class Main {
    constructor() {
        this.container = document.querySelector('#main');
    }

    render = async () => {
        new Page(null, this.container).render(
            `
                <h1>Date4You</h1>
                <h4>ЭКСКЛЮЗИВНОЕ ПРИЛОЖЕНИЕ ДЛЯ <br>ЗНАКОМСТВ ПО ИЗЛЮБЛЕННЫМ МЕСТАМ</h4>
            `
        )
    }
    getContainer = () => {
        return this.container;
    }
}