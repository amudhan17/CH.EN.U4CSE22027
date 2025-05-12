import React, { useState, useEffect } from 'react';

function App() {
  const [stockData, setStockData] = useState(null);
  const [selectedStock, setSelectedStock] = useState('NVDA');
  const [minutes, setMinutes] = useState(30);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const url = `http://20.244.56.144/evaluation-service/stocks/${selectedStock}?minutes=${minutes}`;
    console.log('Fetching data from:', url); // Log the request URL to check if it's correct

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('API response data:', data); // Log the API response to check the structure
        setStockData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching stock data:', error);
        setError('Failed to fetch stock data.');
        setLoading(false);
      });
  }, [selectedStock, minutes]);

  const handleStockChange = (event) => {
    setSelectedStock(event.target.value);
  };

  const handleMinutesChange = (event) => {
    setMinutes(event.target.value);
  };

  return (
    <div>
      <h1>Stock Price Aggregation</h1>

      <div>
        <label>Select Stock: </label>
        <select value={selectedStock} onChange={handleStockChange}>
          <option value="NVDA">Nvidia</option>
          <option value="AAPL">Apple</option>
          <option value="AMZN">Amazon</option>
          <option value="MSFT">Microsoft</option>
          {/* Add more stock options here */}
        </select>
      </div>

      <div>
        <label>Time Interval (minutes): </label>
        <input
          type="number"
          value={minutes}
          onChange={handleMinutesChange}
          min="1"
        />
      </div>

      <button onClick={() => setLoading(true)}>Fetch Data</button>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {stockData && (
        <div>
          <h3>Stock Prices for {selectedStock}</h3>
          <ul>
            {stockData.map((entry, index) => (
              <li key={index}>
                Price: {entry.price}, Last Updated: {new Date(entry.lastUpdatedAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
