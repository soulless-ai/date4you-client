import { Page } from "../../utils/Page.js";
import { UserController } from '../../controllers/User.js';

export class SignUp {
    constructor(socket) {
        this.socket = socket;
        this.container = document.querySelector('#sign-up-section');
        this.packet = null;
        this.clickCount = 0;
    }

    render = async () => {
        new Page(this.socket, this.container).render(
            `
                <button id="exitButton">
                    <img src="/assets/image/svg/x.svg" alt="X It">
                </button>
                <form id="signUpForm">
                    <div class="code-sender-container">
                        <input id="email" name="email" placeholder="email">
                        <button type="submit" id="sendCodeButton">
                            <img src="/assets/image/greater-than.png" alt="Greater than">
                        </button>
                    </div>
                    <div id="errorMessage"><br></div>
                </form>
            `, {
            "#signUpForm": this.onSubmitForm,
            "#sendCodeButton": this.onSubmit,
            "#exitButton": this.handleExit
        });
    };
    onSubmit = async (event) => {
        event.preventDefault();
        this.packet = {
            phone: document.querySelector("#email").value,
        }
        if (this.packet.phone) {
            if (new UserController(this.socket).getComfirm(this.packet)) {
                this.renderSecond();
            } else {
                document.querySelector('#email').classList.add('errorMessageInput');
                this.errorMessenger(`Проверьте, правильно ли вы указали email`);
            }
        } else {
            document.querySelector('#email').classList.add('errorMessageInput');
            this.errorMessenger(`Заполните данные`);
        }
    }
    renderSecond = async () => {
        new Page().hide(
            [this.container]
        );
        new Page(this.socket, this.container).render(
            `
                <button id="backButton">
                    <img src="/assets/image/less-than.png" alt="Less than">
                </button>
                <button id="exitButton">
                    <img src="/assets/image/svg/x.svg" alt="X It">
                </button>
                <form id="signUpForm">
                    <div class="code-sender-container">
                        <input id="code" name="code" placeholder="code">
                        <button type="submit" id="sendCodeButton">
                            <img src="/assets/image/greater-than.png" alt="Greater than">
                        </button>
                    </div>
                    <div id="errorMessage"><br></div>
                </form>
            `, {
            "#signUpForm": this.onSubmitForm,
            "#sendCodeButton": this.onSubmitCode,
            "#backButton": this.handleBack,
            "#exitButton": this.handleExit
        });
    }
    onSubmitCode = async (event) => {
        event.preventDefault();
        this.packet = {
            code: document.querySelector("#code").value,
        }
        if (this.packet.code) {
            const result = await new UserController(this.socket).postComfirm(this.packet);
            if (result.success) {
                this.renderThird();
            } else {
                document.querySelector('#code').classList.add('errorMessageInput');
                this.errorMessenger(`Проверьте, правильно ли вы указали код`);
            }
        } else {
            document.querySelector('#code').classList.add('errorMessageInput');
            this.errorMessenger(`Заполните данные`);
        }
    }

    renderThird = async () => {
        new Page().hide(
            [this.container]
        );
        new Page(this.socket, this.container).render(
            `
                <form id="signUpForm">
                    <input id="name" name="name" placeholder="name">
                    <input id="lastname" name="lastname" placeholder="lastname">

                    <label for="age">Возраст *</label>
                    <input type="text" id="age" name="age" required>
                
                    <label for="nickname">Ник для сайта *</label>
                    <input type="text" id="nickname" name="nickname" required>
                
                    <label for="instagram">Ник Instagram</label>
                    <input type="text" id="instagram" name="instagram">
                
                    <label for="about">О себе * (один интересный факт)</label>
                    <textarea id="about" name="about" required></textarea>
                
                    <label for="interests">Интересы * (выберите из списка)</label>
                    <select id="interests" name="interests" multiple required>
                        <option value="tennis">Теннис</option>
                        <option value="travel">Путешествия</option>
                        <!-- Добавьте другие опции интересов -->
                    </select>
                
                    <label for="zodiac">Знак зодиака</label>
                    <input type="text" id="zodiac" name="zodiac">
                
                    <label for="dating">В подборке для знакомства</label>
                    <input type="radio" id="women" name="dating" value="women" required>
                    <label for="women">Женщины</label>

                    <input type="radio" id="men" name="dating" value="men" required>
                    <label for="men">Мужчины</label>

                    <input type="radio" id="both" name="dating" value="both" required>
                    <label for="both">Женщины/Мужчины</label>
                    <div id="errorMessage"><br></div>

                    <button id="signUpButton" type="submit">Отправить</button>
                </form>
            `, {
            "#signUpForm": this.onSubmitForm,
            "#signUpButton": this.handleSignUpButtonSubmitSecond,
        });
    }

    handleSignUpButtonSubmitSecond = async (event) => {
        event.preventDefault();
        this.packet = {
            age: document.querySelector("#age").value,
            nickname: document.querySelector("#nickname").value,
            instagram: document.querySelector("#instagram").value,
            about: document.querySelector("#about").value,
            interests: document.querySelector("#interests").value,
            zodiac: document.querySelector("#zodiac").value,
            dating: new Page().getSelectedRadioButtonValue('dating')
        }
        if (this.packet.code) {
            const result = await new UserController(this.socket).postComfirm(this.packet);
            if (result.success) {
                this.renderThird();
            } else {
                document.querySelector('#code').classList.add('errorMessageInput');
                this.errorMessenger(`Проверьте, правильно ли вы указали код`);
            }
        } else {
            document.querySelector('#code').classList.add('errorMessageInput');
            this.errorMessenger(`Заполните данные`);
        }
    }

    onSubmitForm = async (event) => {
        event.preventDefault();
    }
    errorMessenger = async (data) => {
        document.querySelector('#errorMessage').innerHTML = data;
    }
    handleBack = async () => {
        new Page().hide(
            [this.container]
        );
        this.render();
    }
    handleExit = async () => {
        new Page().hide(
            [this.container]
        );
        new Page().getMainContent(this.socket);
    }
}