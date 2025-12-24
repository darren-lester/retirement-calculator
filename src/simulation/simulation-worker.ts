self.onmessage = (event) => {
    console.log(JSON.stringify(event.data, null, 2));

    // run the simulations
    setTimeout(() => {
        postMessage({ message: 'simulation complete' });
    }, 5000);
};