import { sendDataToServer } from '../utils/serverUtils.js';

export class UserController {
    constructor(socket) {
        this.socket = socket;
    }
    login = (data) => {
        try {
            return sendDataToServer(
                this.socket,
                {
                    className: 'user',
                    type: 'login',
                    data: data
                }
            )
        } catch (error) {
            console.log(error);
        }
    }
    post = (data) => {
        try {
            return sendDataToServer(
                this.socket,
                {
                    className: 'user',
                    type: 'post',
                    data: data
                }
            )
        } catch (error) {
            console.log(error);
        }
    }
    get = (data) => {
        try {
            return sendDataToServer(
                this.socket, 
                {
                    className: 'user',
                    type: 'get',
                    data: data
                }
            )
        } catch (error) {
            console.log(error);
        }
    }
    postComfirm = (data) => {
        try {
            return sendDataToServer(
                this.socket, 
                {
                    className: 'comfirm-code',
                    type: 'post',
                    data: data
                }
            )
        } catch (error) {
            console.log(error);
        }
    }
    getComfirm = (data) => {
        try {
            return sendDataToServer(
                this.socket, 
                {
                    className: 'comfirm-code',
                    type: 'get',
                    data: data
                }
            )
        } catch (error) {
            console.log(error);
        }
    }
}