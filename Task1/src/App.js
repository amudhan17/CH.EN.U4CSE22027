import React, { useState, useEffect } from 'react';

function App() {
  const [stockData, setStockData] = useState([]);
  const [selectedStock, setSelectedStock] = useState('NVDA');
  const [minutes, setMinutes] = useState(30);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    setFetched(false);

    // Simulated API response (dummy data)
    setTimeout(() => {
      const dummyData = Array.from({ length: 5 }, (_, i) => ({
        price: (700 + Math.random() * 50).toFixed(2),
        lastUpdatedAt: new Date(Date.now() - i * minutes * 60000).toISOString(),
      }));

      setStockData(dummyData.reverse());
      setFetched(true);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    fetchData();
  }, [selectedStock, minutes]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>📈 Stock Price Viewer</h1>

      <div style={{ marginBottom: '10px' }}>
        <label><b>Select Stock:</b> </label>
        <select
          value={selectedStock}
          onChange={(e) => setSelectedStock(e.target.value)}
        >
          <option value="NVDA">Nvidia</option>
          <option value="AAPL">Apple</option>
          <option value="AMZN">Amazon</option>
          <option value="MSFT">Microsoft</option>
        </select>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label><b>Minutes:</b> </label>
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          min="1"
        />
      </div>

      <button onClick={fetchData} style={{ padding: '8px 16px' }}>
        Fetch Data
      </button>

      {loading && <p>🔄 Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {fetched && stockData.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Stock Prices for {selectedStock}</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {stockData.map((entry, index) => (
              <li key={index}>
                📌 <b>Price:</b> ${entry.price} — 🕒{' '}
                {new Date(entry.lastUpdatedAt).toLocaleTimeString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
