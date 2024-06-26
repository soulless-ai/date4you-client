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
            document.querySelector(selector).addEventListener("click", callback);
        });
    }

    getSelectedRadioButtonValue = (name) => {
        const radioButtons = document.querySelectorAll(`input[type="radio"][name="${name}"]`);
        let selectedValue = null;
        radioButtons.forEach((radio) => {
            if (radio.checked) selectedValue = radio.value;
        });
        return selectedValue;
    }

    getMainContent = (socket) => {
        console.log("wtsapp")
        new Header().render();
        new Main().render();
        new Footer(socket).render();
    }
}