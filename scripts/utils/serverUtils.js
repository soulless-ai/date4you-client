export function sendDataToServer(socket, message) {
    try {
        socket.send(JSON.stringify(message));

        return new Promise((resolve, reject) => {
            socket.addEventListener('message', (event) => {
                console.log('Response:', event.data);
                resolve(JSON.parse(event.data));
            });

            socket.addEventListener('error', (error) => {
                console.error('Error:', error);
                reject(error);
            });
        });
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}