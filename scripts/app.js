import { Page } from './utils/Page.js';
import config from './config.js';

const token = localStorage.getItem('authenticate');

const socket = new WebSocket('wss://' + config.serverDomain);

socket.addEventListener('open', function (event) {
    console.log('Connected to server');
    socket.send(JSON.stringify({ 
        className: 'authenticate',
        type: 'get',
        data: {
            token: token
        }
    }));
});
socket.addEventListener('message', function (event) {
    if (isJSON(event.data)) {
        try {
            const result = JSON.parse(event.data);
            switch (result.className) {
                case 'authenticate':
                    if (result.token) {
                        console.log("yes")
                    } else if (result.error === 'Invalid token') {
                        console.log("yo")
                        new Page().getMainContent(socket);
                    }
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Failed to parse JSON:', error);
            // Добавьте соответствующую логику обработки ошибок разбора JSON здесь
        }
    } else {
        // Обрабатываем сообщение как обычный текст
        console.log('Message from server:', event.data);
        // Добавьте соответствующую логику для обработки текстовых сообщений здесь
    }
});

function isJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (error) {
        return false;
    }
}