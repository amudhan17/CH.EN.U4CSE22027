import React, { useState, useEffect } from 'react';

function App() {
  const [stockData, setStockData] = useState([]);
  const [minutes, setMinutes] = useState(50);
  const [selectedStock, setSelectedStock] = useState("NVDA"); // Default stock NVDA
  const [stockList, setStockList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch available stocks on mount
  useEffect(() => {
    fetch("http://20.244.56.144/evaluation-service/stocks")
      .then(response => response.json())
      .then(data => setStockList(Object.keys(data.stocks)))
      .catch(error => console.error("Error fetching stock list:", error));
  }, []);

  // Fetch stock data based on selected stock and minutes
  useEffect(() => {
    setLoading(true);
    fetch(`http://20.244.56.144/evaluation-service/stocks/${selectedStock}?minutes=${minutes}`)
      .then(response => response.json())
      .then(data => {
        setStockData(data);
        setLoading(false);
      })
      .catch(error => {
        setError("Failed to fetch stock data.");
        setLoading(false);
      });
  }, [selectedStock, minutes]);

  // Chart plotting function
  const plotChart = () => {
    const canvas = document.getElementById('stockChart');
    const ctx = canvas.getContext('2d');
    const labels = stockData.map(item => new Date(item.lastUpdatedAt).toLocaleTimeString());
    const prices = stockData.map(item => item.price);

    // Simple line chart plotting
    const data = {
      labels: labels,
      datasets: [
        {
          label: `${selectedStock} Price`,
          data: prices,
          borderColor: 'blue',
          fill: false,
        },
      ],
    };

    new window.Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            mode: 'nearest',
            intersect: false,
          },
        },
        scales: {
          x: {
            type: 'category',
            labels: labels,
          },
          y: {
            beginAtZero: false,
          },
        },
      },
    });
  };

  // Trigger chart plotting after stock data is fetched
  useEffect(() => {
    if (stockData.length > 0) {
      plotChart();
    }
  }, [stockData]);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Stock Price Aggregation</h1>
      
      <label>
        Select Stock:
        <select 
          value={selectedStock} 
          onChange={(e) => setSelectedStock(e.target.value)}
        >
          {stockList.map((stock, index) => (
            <option key={index} value={stock}>
              {stock}
            </option>
          ))}
        </select>
      </label>
      <br />

      <label>
        Time Interval (minutes):
        <input 
          type="number" 
          value={minutes} 
          onChange={(e) => setMinutes(e.target.value)} 
        />
      </label>
      <br />

      <button onClick={() => setMinutes(minutes)}>Fetch Data</button>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div>
          <canvas id="stockChart" width="400" height="200"></canvas>
        </div>
      )}
    </div>
  );
}

export default App;
