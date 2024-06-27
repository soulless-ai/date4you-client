import { Page } from "../../utils/Page.js";
import { UserController } from '../../controllers/User.js';
import { Footer } from "../app/Footer.js";
import { News } from "../app/list/News.js";

export class SignUp {
    constructor(socket) {
        this.socket = socket;
        this.container = document.querySelector('#sign-up-section');
        this.clickCount = 0;
        this.packet = {};
    }

    render = async () => {
        new Page(this.socket, this.container).render(
            `
                <button id="exitButton">
                    <img src="/assets/image/svg/x.svg" alt="X It">
                </button>
                <h1>Какой у вас <br>электронный адрес?</h1>
                <p>Пожалуйста, укажите ваш почтовый адрес для подтверждения, <br>что вы не являетесь ботом и мы могли иметь с вами дальнейшую связь</p>
                <form id="signUpForm">
                    <div class="input-sender-container">
                        <div class="block-for-fly-placeholder">
                            <input id="email" name="email" placeholder="" required>
                            <label class="fly-placeholder" for="email">Укажите ваш email:</label>
                        </div>
                        <button type="submit" id="sendCodeButton">
                            <img src="/assets/image/greater-than.png" alt="Greater than">
                        </button>
                    </div>
                    <div id="errorMessage"><br></div>
                </form>
            `, {
            "#sendCodeButton": this.onSubmit,
            "#exitButton": this.handleExit
        });
        new Page().addInputEventListeners();
    };
    onSubmit = async (event) => {
        event.preventDefault();
        this.packet.phone = document.querySelector("#email").value;
        if (this.packet.phone) {
            if (new UserController(this.socket).getComfirm(this.packet)) {
                this.renderCodePage();
            } else {
                new Page().displayError([ "#email", "#sendCodeButton" ], "Проверьте, правильно ли вы указали email");
            }
        } else {
            new Page().displayError([ "#email", "#sendCodeButton" ], "Заполните данные");
        }
    }
    renderCodePage = async () => {
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
                <h1>Введите полученный код</h1>
                <p>Ниже укажите отправленный на ваш почтовый адрес код подтверждения, если вы по каким-то причинам не получили его, вернитесь на изначальный экран регистрации</p>
                <form id="signUpForm">
                    <div class="code-input-container">
                        <input type="text" maxlength="1" class="code-input" id="digit1">
                        <input type="text" maxlength="1" class="code-input" id="digit2">
                        <input type="text" maxlength="1" class="code-input" id="digit3">
                        <input type="text" maxlength="1" class="code-input" id="digit4">
                        <input type="text" maxlength="1" class="code-input" id="digit5">
                        <input type="text" maxlength="1" class="code-input" id="digit6">
                    </div>
                    <div id="errorMessage"><br></div>
                    <div class="sign-up-section-footer">
                        <button type="submit" id="sendCodeButton"> Продолжить </button>
                        <ul>
                            <li>Политика конфиденциальности</li>
                        </ul>
                    </div>
                </form>
            `, {
            "#sendCodeButton": this.onSubmitCode,
            "#backButton": this.handleBack,
            "#exitButton": this.handleExit
        })
        new Page().addInputEventListeners();
        new Page().setupCodeInputFields(
            document.querySelectorAll('.code-input'),
            document.getElementById('signUpForm'),
            this.onSubmitCode);
    }
    onSubmitCode = async (event) => {
        event.preventDefault();
        let code = "";
        document.querySelectorAll('.code-input').forEach(input => {
            code += input.value;
        });
        this.packet.code = code;
        if (this.packet.code) {
            const result = await new UserController(this.socket).postComfirm(this.packet);
            if (result.success) {
                this.renderAvatarPage();
            } else {
                new Page().displayError([ "#code", "#sendCodeButton" ], "Проверьте, правильно ли вы указали код");
            }
        } else {
            new Page().displayError([ "#code", "#sendCodeButton" ], "Заполните данные");
        }
    }
    renderAvatarPage = async () => {
        new Page().hide([this.container]);
        new Page(this.socket, this.container).render(
            `
                <button id="backButton">
                    <img src="/assets/image/less-than.png" alt="Less than">
                </button>
                <button id="exitButton">
                    <img src="/assets/image/svg/x.svg" alt="X It">
                </button>
                <form id="signUpForm">
                    <h1>Начните украшать ваш профиль</h1>
                    <p>Выберите фото для вашей аватарки, чтобы привысить процент возможных знакомств. <br>Приложения поддерживает общедоступные файлы изображений</p>
                    <input type="file" id="avatarInput" accept="image/*">
                    <div id="previewContainer">
                        <img id="avatarPreview" src="" alt="Preview" style="display: none;">
                    </div>
                    <div id="errorMessage"><br></div>
                    <div class="sign-up-section-footer">
                        <button type="submit" id="submit">Добавить фото</button>
                        <button id="continue">Продолжить</button>
                    </div>
                </form>
            `, {
            "#submit": this.onSubmitAvatar,
            "#backButton": this.handleBack,
            "#exitButton": this.handleExit,
            "#avatarInput": this.handleAvatarInput
        });
        new Page().addInputEventListeners();
    };
    handleAvatarInput = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('avatarPreview');
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    };
    onSubmitAvatar = async (event) => {
        event.preventDefault();
        const avatarInput = document.getElementById('avatarInput');
        const formData = new FormData(document.getElementById('signUpForm'));
        if (avatarInput.files.length > 0) formData.append('avatar', avatarInput.files[0]);
        else formData.append('avatar', null);  // Или formData.append('avatar', '');
    
        this.packet.avatar = formData;
    
        console.log('Form submitted:', this.packet.avatar);
        this.renderSecond();
    };

    renderSecond = async () => {
        new Page().hide(
            [this.container]
        );
        new Page(this.socket, this.container).render(
            `
                <button id="exitButton">
                    <img src="/assets/image/svg/x.svg" alt="X It">
                </button>
                <form id="signUpForm" class="sign-up-last-form">
                    <div class="block-for-fly-placeholder">
                        <input id="name" name="name" placeholder="" required>
                        <label class="fly-placeholder" for="name">Ваше имя:</label>
                    </div>

                    <div class="block-for-fly-placeholder">
                        <input id="lastname" name="lastname" placeholder="" required>
                        <label class="fly-placeholder" for="lastname">Ваша фамилия:</label>
                    </div>
                    
                    <div class="birth-gender-container">
                        <section>
                            <label for="birthdate">Дата рождения:</label>
                            <div id="birthdate" class="birthdate-select selecter" tabindex="0">
                                <span id="selectedBirthdate" class="selected-option">Выберите дату</span>
                            </div>
                        </section>
                        <section>
                            <fieldset>
                                <legend>Ваш пол:</legend>
                                <div>
                                    <label for="male">Мужчина</label>
                                    <input type="radio" id="male" name="gender" value="male" checked>
                                </div>
                                <div class="fieldset-radio-container-line"></div>
                                <div>
                                    <label for="female">Женщина</label>
                                    <input type="radio" id="female" name="gender" value="female">
                                </div>
                            </fieldset>
                        </section>
                    </div>

                    <div class="block-for-fly-placeholder">
                        <input type="text" id="nickname" name="nickname" placeholder="" required>
                        <label class="fly-placeholder" for="nickname">Ник для сайта:</label>
                    </div>
                    
                    <div class="block-for-fly-placeholder block-instagram">
                        <input type="text" id="instagram" name="instagram" placeholder="" required>
                        <label class="block-instagram-label fly-placeholder" for="instagram">Ник Instagram:</label>
                        <label class="block-instagram-icon" for="instagram">@</label>
                    </div>

                    <fieldset>
                        <legend>О себе (один интересный факт)</legend>
                        <textarea id="about" name="about" required></textarea>
                    </fieldset>

                    <fieldset class="interests-checkbox-container">
                        <legend>Интересы (выберите из списка):</legend>
                        <div>
                            <input type="checkbox" id="interest_tennis" name="interests" value="tennis">
                            <label for="interest_tennis">Теннис</label>
                        </div>
                        <div>
                            <input type="checkbox" id="interest_travel" name="interests" value="travel">
                            <label for="interest_travel">Путешествия</label>
                        </div>
                        <!-- Добавьте другие опции интересов -->
                        <div>
                            <input type="checkbox" id="interest_walk" name="interests" value="walk">
                            <label for="interest_walk">Гулять</label>
                        </div>
                        <div>
                            <input type="checkbox" id="interest_dance" name="interests" value="dance">
                            <label for="interest_dance">Танцевать</label>
                        </div>
                        <div>
                            <input type="checkbox" id="interest_swim" name="interests" value="swim">
                            <label for="interest_swim">Плавать</label>
                        </div>
                        <div>
                            <input type="checkbox" id="interest_films" name="interests" value="films">
                            <label for="interest_films">Фильмы</label>
                        </div>
                        <div>
                            <input type="checkbox" id="interest_play_playstation" name="interests" value="play_playstation">
                            <label for="interest_play_playstation">Играть в PlayStation</label>
                        </div>
                        <div>
                            <input type="checkbox" id="interest_music" name="interests" value="music">
                            <label for="interest_music">Слушать музыку</label>
                        </div>
                    </fieldset>
                    
                    <div id="zodiac" class="zodiac-select selecter" tabindex="0">
                        <span id="selectedZodiac" class="selected-option">Выберите знак зодиака</span>
                    </div>
                    
                    <fieldset class="dating-radio-container">
                        <legend>В подборке для знакомства:</legend>
                        <div>
                            <label for="men">Мужчины</label>
                            <input type="radio" id="men" name="dating" value="men">
                        </div>
                        <div class="fieldset-radio-container-line"></div>
                        <div>
                            <label for="women">Женщины</label>
                            <input type="radio" id="women" name="dating" value="women">
                        </div>
                        <div class="fieldset-radio-container-line"></div>
                        <div>
                            <label for="both">М/Ж</label>
                            <input type="radio" id="both" name="dating" value="both" checked>
                        </div>
                    </fieldset>
                    <div id="errorMessage"><br></div>
                    <button id="signUpButton" type="submit">Отправить</button>
                </form>
            `, {
            "#signUpButton": this.handleSignUpButtonSubmitSecond,
            "#exitButton": this.handleExit,
        });
        new Page().addInputEventListeners();
    }

    handleSignUpButtonSubmitSecond = async (event) => {
        event.preventDefault();
        this.packet.name = document.querySelector("#name").value;
        this.packet.lastname = document.querySelector("#lastname").value;
        this.packet.birthdate = document.querySelector("#selectedBirthdate").textContent;;
        this.packet.gender = new Page().getSelectedRadioButtonValue('gender');
        this.packet.nickname = document.querySelector("#nickname").value;
        this.packet.instagram = document.querySelector("#instagram").value;
        this.packet.about = document.querySelector("#about").value;
        this.packet.interests = Array.from(document.querySelectorAll("input[name='interests']:checked")).map(el => el.value);
        this.packet.zodiac = document.querySelector("#selectedZodiac").textContent;;
        this.packet.dating = new Page().getSelectedRadioButtonValue('dating');

        console.log(this.packet)
        new Page().clearErrorStyles();

        const errors = ["#signUpButton"];
        if (!this.packet.name) errors.push("#name");
        if (!this.packet.lastname) errors.push("#lastname");
        if (!this.packet.nickname) errors.push("#nickname");
        if (this.packet.birthdate === "Выберите дату") errors.push("#selectedBirthdate");
        if (!this.packet.about) errors.push("#about");
        if (this.packet.interests.length === 0) errors.push("input[name='interests']");
        if (this.packet.zodiac === "Выберите знак зодиака") this.packet.zodiac = '';

        if (errors.length > 0) {
            new Page().displayError(errors, "Заполните данные");
        } else {
            const result = await new UserController(this.socket).post(this.packet);
            if (result.success) {
                console.log("yes")
                new Page().hide(
                    [this.container]
                );
                new News(this.socket).render();
                new Footer(this.socket).render();
            } else {
                new Page().displayError(signUpButton, "Проверьте, правильно ли вы указали данные");
            }
        }
    }
    
    handleBack = async () => {
        new Page().hide( [this.container] );
        this.render();
    }
    handleExit = async () => {
        new Page().hide( [this.container] );
        new Page().getMainContent(this.socket);
    }
}