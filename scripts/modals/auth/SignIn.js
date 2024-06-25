import { Page } from "../../utils/Page.js";
import { UserController } from '../../controllers/User.js';

export class SignIn {
    constructor(socket) {
        this.socket = socket;
        this.container = document.querySelector('#sign-in-section');
        this.onSubmit = this.onSubmit.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }

    render = async () => {
        new Page(this.socket, this.container).render(
            `
                <button id="backButton">X</button>
                <form id="signInForm">
                    <input id="loginInput" type="text" placeholder="login">
                    <input id="emailInput" type="email" placeholder="email">
                    <button type="button" id="forgotButton">Забыли данные?</button>
                    <button type="submit" id="signInButton">Войти</button>
                </form>
            `, {
            "#signInForm": this.onSubmit,
            "#backButton": this.handleBack
        });
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const data = {
            login: document.querySelector("#loginInput").value,
            email: document.querySelector("#emailInput").value
        }
        if (data.login && data.email) {
            new UserController(this.socket).get(data);
        } else {
            // Handle empty fields error
            console.error("Login and email fields are required");
        }
    }

    handleBack = async () => {
        new Page().hide(
            [this.container]
        );
        new Page().getMainContent(this.socket);
    }
}