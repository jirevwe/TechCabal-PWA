if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then((registration) => {
            console.log('Service Worker Registered');
        }).catch((err) => {
            console.log('Service Worker Failed to register', err);
        });
}