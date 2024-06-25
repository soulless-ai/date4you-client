import { Page } from "../../utils/Page.js";
import { SignIn } from "./SignIn.js";
import { SignUp } from "./SignUp.js";

export class Auth {
    constructor(socket) {
        this.socket = socket;
        this.container = document.querySelector('#auth-section');
        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
    }

    get = () => {
        new Page(this.socket, this.container).render(
            `
                <button id="inButton">Войти</button>
                <button id="upButton">Присоединиться</button>
            `, {
            "#inButton": this.handleSignIn,
            "#upButton": this.handleSignUp
        });
    }
    getContainer = () => {
        return this.container;
    }
    handleSignIn = async (event) => {
        new Page().hide(this.container);
        new SignIn(this.socket).get();
    }
    handleSignUp = async (event) => {
        new Page().hide(this.container);
        new SignUp(this.socket).get();
    }
}