if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
            console.log('sw registed!');
        });
}

window.addEventListener('beforeinstallpromt', (event) => {
    console.log('beforeinstallprompt fired');
    event.preventDefault();
    defaultPrompt = event;
    return false;
});