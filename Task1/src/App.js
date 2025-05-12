import React, { useState, useEffect } from 'react';

function App() {
  const [stockData, setStockData] = useState(null);
  const [selectedStock, setSelectedStock] = useState('NVDA');
  const [minutes, setMinutes] = useState(30);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStockData = () => {
    setLoading(true);
    setError(null);

    const url = `http://20.244.56.144/evaluation-service/stocks/${selectedStock}?minutes=${minutes}`;
    console.log('Fetching data from:', url);

    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        console.log('API response data:', data);
        setStockData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching stock data:', error);
        setError('Failed to fetch stock data.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStockData();
  }, [selectedStock, minutes]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1> Stock Price Aggregation</h1>

      <div>
        <label>Select Stock: </label>
        <select value={selectedStock} onChange={(e) => setSelectedStock(e.target.value)}>
          <option value="NVDA">Nvidia</option>
          <option value="AAPL">Apple</option>
          <option value="AMZN">Amazon</option>
          <option value="MSFT">Microsoft</option>
          {/* Add more stock options if needed */}
        </select>
      </div>

      <div style={{ marginTop: '10px' }}>
        <label>Time Interval (minutes): </label>
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          min="1"
          style={{ width: '60px' }}
        />
      </div>

      <button onClick={fetchStockData} style={{ marginTop: '10px' }}>Fetch Data</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {stockData && (
        <div style={{ marginTop: '20px' }}>
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
