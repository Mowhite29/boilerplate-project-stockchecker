async function stockAPI(symbol) {
    let url = 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/' + symbol + '/quote';
    fetch(url, { method: 'GET' })
        .then(response => {
            return {
                symbol: response.json().symbol,
                price: response.json().latestPrice
            }
        })
}

export stockAPI;