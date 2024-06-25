import { Page } from "../../utils/Page.js";
import { SignIn } from "../auth/SignIn.js";
import { SignUp } from "../auth/SignUp.js";
import { Header } from "./Header.js";
import { Main } from "./Main.js";

export class Footer {
    constructor(socket) {
        this.socket = socket;
        this.container = document.querySelector('footer');
        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
    }

    render = async () => {
        new Page(this.socket, this.container).render(
            `
                <button id="inButton">Войти</button>
                <button id="upButton">Присоединиться</button>
            `, {
            "#inButton": this.handleSignIn,
            "#upButton": this.handleSignUp
        });
    }

    handleSignIn = () => {
        new Page().hide(
            [
                this.container,
                new Header().getContainer(),
                new Main().getContainer()
            ]
        );
        new SignIn(this.socket).render();
    }
    handleSignUp = () => {
        new Page().hide(
            [
                this.container,
                new Header().getContainer(),
                new Main().getContainer()
            ]
        );
        new SignUp(this.socket).render();
    }

    getContainer = () => {
        return this.container;
    }
}
