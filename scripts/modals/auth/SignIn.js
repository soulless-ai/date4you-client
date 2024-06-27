import { Page } from "../../utils/Page.js";
import { UserController } from '../../controllers/User.js';
import { App } from "../app/App.js";

export class SignIn {
    constructor(socket) {
        this.socket = socket;
        this.container = document.querySelector('#sign-in-section');
        this.packet = {};
    }

    render = async () => {
        new Page(this.socket, this.container).render(
            `
                <button id="exitButton">
                    <img src="/assets/image/svg/x.svg" alt="X It">
                </button>
                <form id="signInForm">
                    <div class="block-for-fly-placeholder">
                        <input id="login" type="text" placeholder="">
                        <label class="fly-placeholder" for="login">Введите ваш логин:</label>
                    </div>
                    <div class="block-for-fly-placeholder">
                        <input id="email" type="email" placeholder="">
                        <label class="fly-placeholder" for="email">Войдите через почтовый адрес:</label>
                    </div>
                    <div id="errorMessage"><br></div>
                    <button type="submit" id="signInButton">Войти</button>
                </form>
            `, {
            "#signInButton": this.onSubmit,
            "#exitButton": this.handleExit
        });
        new Page().addInputEventListeners();
    }

    onSubmit = async (event) => {
        event.preventDefault();
        this.packet.nickname = document.querySelector("#login").value;
        this.packet.phone = document.querySelector("#email").value;
        if (this.packet.nickname && this.packet.phone) {
            const result = await new UserController(this.socket).login(this.packet);
            console.log(result);
            if (result.success) {
                new Page().hide(
                    [this.container]
                );
                new App(this.socket).render();
            } else {
                new Page().displayError([ "#login", "#email" ], "Неправильно");
            }
        } else {
            new Page().displayError([ "#login", "#email" ], "Заполните данные");
        }
    }

    handleBack = async () => {
        new Page().hide( [this.container] );
        new Page().getMainContent(this.socket);
    }
    handleExit = async () => {
        new Page().hide( [this.container] );
        new Page().getMainContent(this.socket);
    }
}