import { Footer } from "../modals/main/Footer.js";
import { Header } from "../modals/main/Header.js";
import { Main } from "../modals/main/Main.js";

export class Page {
    constructor(socket, container = document.body) {
        this.socket = socket;
        this.container = container;
    }
    
    render = (inner, listeners = {}) => {
        this.container.innerHTML = inner;
        this.initListeners(listeners);
        this.container.classList.remove('hide');
    };
    
    hide = async (containers) => {
        containers.forEach(container => {
            container.innerHTML = '';
            container.classList.add('hide');
        });
    }

    initListeners = (listeners) => {
        Object.entries(listeners).forEach(([selector, callback]) => {
            const element = document.querySelector(selector);
            if (element) {
                element.addEventListener("click", callback);
            } else {
                console.error(`Element with selector '${selector}' not found`);
            }
        });
    }
    getSelectedRadioButtonValue = (name) => {
        const radios = document.querySelectorAll(`input[type="radio"][name="${name}"]`);
        for (const radio of radios) {
            if (radio.checked) {
                return radio.value;
            }
        }
        return null;
    }

    getMainContent = (socket) => {
        new Header().render();
        new Main().render();
        new Footer(socket).render();
    }

    addInputEventListeners = () => {
        this.addInputFlyListeners(document.querySelectorAll('.block-for-fly-placeholder'));
        this.addSelectBirthdayListener(document.querySelector('#birthdate'));
        this.addSelectZodiacListener(document.querySelector('#zodiac'));
    };

    addInputFlyListeners = (data) => {
        if (!data) return null;
        data.forEach(block => {
            const input = block.querySelector('input');
            const flyElement = block.querySelector('.fly-placeholder');

            input.addEventListener("input", () => {
                if (input.value.trim() === "") {
                    flyElement.classList.remove("active");
                } else {
                    flyElement.classList.add("active");
                }
                input.classList.remove('errorInput')
            });
        });
    }
    addSelectBirthdayListener = (data) => {
        if (!data) return null;
        // Генерируем список лет (от 1920 до текущего года)
        const currentYear = new Date().getFullYear();
        const startYear = 1920;
        const years = [];
        for (let year = currentYear; year >= startYear; year--) {
            years.push(year);
        }

        const selectedOption = data.querySelector('#selectedBirthdate');

        const optionsList = document.createElement('ul');
        optionsList.classList.add('options-list');
        years.forEach(year => {
            const listItem = document.createElement('li');
            listItem.textContent = year;
            listItem.addEventListener('click', () => {
                selectYear(year);
                selectedOption.classList.remove('open');
                optionsList.classList.remove('open');
            });
            optionsList.appendChild(listItem);
        });
        data.appendChild(optionsList);

        function selectYear(year) {
            selectedOption.textContent = year;
            selectedOption.classList.remove('open');
            optionsList.classList.remove('open');
        }

        selectedOption.addEventListener('click', () => {
            selectedOption.classList.toggle('open');
            optionsList.classList.toggle('open');
        });
        document.addEventListener('click', (event) => {
            if (!data.contains(event.target)) {
                selectedOption.classList.remove('open');
                selectedOption.classList.remove('errorInput')
                optionsList.classList.remove('open');
            }
        });
    }
    addSelectZodiacListener = (data) => {
        if(!data) return null;
        const zodiacSigns = [
            'Отложить', 'Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
            'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
        ];

        const selectedOption = data.querySelector('#selectedZodiac');

        const optionsList = document.createElement('ul');
        optionsList.classList.add('options-list');
        zodiacSigns.forEach(sign => {
            const listItem = document.createElement('li');
            listItem.textContent = sign;
            listItem.addEventListener('click', () => {
                selectZodiac(sign);
                selectedOption.classList.remove('open');
                optionsList.classList.remove('open');
            });
            optionsList.appendChild(listItem);
        });
        data.appendChild(optionsList);

        function selectZodiac(sign) {
            selectedOption.textContent = sign;
            selectedOption.classList.remove('open');
            optionsList.classList.remove('open');
        }

        selectedOption.addEventListener('click', () => {
            selectedOption.classList.toggle('open');
            optionsList.classList.toggle('open');
        });
        document.addEventListener('click', (event) => {
            if (!data.contains(event.target)) {
                selectedOption.classList.remove('open');
                selectedOption.classList.remove('errorInput')
                optionsList.classList.remove('open');
            }
        });
    }

    displayError = (selectors, message) => {
        console.log(selectors);
        selectors.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                if (element.tagName === 'BUTTON') {
                    element.classList.add('errorBackground');
                } else if (element.tagName === 'TEXTAREA') {
                    const fieldset = element.closest('fieldset');
                    if (fieldset) {
                        fieldset.classList.add('errorBorder');
                    }
                } else if (element.tagName === 'INPUT' && element.type === 'checkbox') {
                    const parentDiv = element.closest('div');
                    if (parentDiv) {
                        const fieldset = parentDiv.closest('fieldset');
                        if (fieldset) {
                            fieldset.classList.add('errorBorder');
                        }
                    }
                } else {
                    element.classList.add('errorBorder');
                }
            }
        });
        this.errorMessenger(message);
    }
    errorMessenger = async (data) => {
        document.querySelector('#errorMessage').innerHTML = data;
    }
    clearErrorStyles = () => {
        const errorFields = document.querySelectorAll('.errorInput');
        errorFields.forEach(field => field.classList.remove('errorInput'));
    }
    setupCodeInputFields = (inputs, form, onSubmit) => {
        inputs.forEach((input, index) => {
            input.addEventListener('focus', (event) => {
                const firstEmptyInput = this.getNextEmptyInput(inputs, 0);
                if (firstEmptyInput && firstEmptyInput !== input) {
                    firstEmptyInput.focus();
                }
            });

            input.addEventListener('input', (event) => {
                const value = input.value.replace(/[^0-9]/g, '');
                input.value = value;

                if (value.length === 1) {
                    const nextInput = this.getNextEmptyInput(inputs, index + 1);
                    if (nextInput) {
                        nextInput.focus();
                    }
                }

                this.updateBackground(input);
                this.checkAndSubmitForm(inputs, form, onSubmit);
            });

            input.addEventListener('keydown', (event) => {
                if (event.key === 'Backspace') {
                    if (input.value === '' && index > 0) {
                        inputs[index - 1].focus();
                        inputs[index - 1].value = '';
                        this.updateBackground(inputs[index - 1]);
                    } else {
                        input.value = '';
                        this.updateBackground(input);
                    }
                }
            });

            input.addEventListener('paste', (event) => {
                event.preventDefault();
                const pasteData = event.clipboardData.getData('text').replace(/[^0-9]/g, '');
                const availableSpace = inputs.length - index;

                for (let i = 0; i < Math.min(pasteData.length, availableSpace); i++) {
                    inputs[index + i].value = pasteData[i];
                    this.updateBackground(inputs[index + i]);
                }

                const nextInput = this.getNextEmptyInput(inputs, 0);
                if (nextInput) {
                    nextInput.focus();
                }
                this.checkAndSubmitForm(inputs, form, onSubmit);
            });
        });
        this.focusFirstEmptyInput(inputs);
    }

    updateBackground = (input) => {
        input.style.backgroundColor = input.value ? '#800080' : '#FFFFFF';
    }

    checkAndSubmitForm = (inputs, form, onSubmit) => {
        const allFilled = Array.from(inputs).every(input => input.value.length === 1);
        if (allFilled) {
            onSubmit(new Event('submit'));
        }
    }

    focusFirstEmptyInput = (inputs) => {
        const firstEmptyInput = this.getNextEmptyInput(inputs, 0);
        if (firstEmptyInput) {
            firstEmptyInput.focus();
        }
    }
    
    getNextEmptyInput = (inputs, startIndex) => {
        for (let i = startIndex; i < inputs.length; i++) {
            if (inputs[i].value === '') {
                return inputs[i];
            }
        }
        return null;
    }

    avatarPreview = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewElements = document.querySelectorAll('.avatar-preview');
                previewElements.forEach(preview => {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                });
            };
            reader.readAsDataURL(file);
        }
    };
}