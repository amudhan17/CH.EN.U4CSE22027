import React, { useState } from 'react';

const App = () => {
  const [numberType, setNumberType] = useState('p');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mockFetchNumbers = async () => {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      try {
        const mockData = {
          windowPrevState: [1, 2, 3, 5, 7],
          windowCurrState: [1, 2, 3, 5, 7, 11],
          numbers: [1, 2, 3, 5, 7, 11], 
          avg: 4.33, 
        };
        setResponse(mockData);
      } catch (err) {
        setError("Error: Failed to fetch");
      } finally {
        setLoading(false);
      }
    }, 1000); 
  };

  
  const calculateAverage = (numbers) => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return (sum / numbers.length).toFixed(2);
  };

  const handleWindowState = (numbers) => {
    if (numbers.length > 10) {
      return numbers.slice(-10);
    }
    return numbers;
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Average Calculator Microservice</h1>
      
      <div style={{ padding: '20px', marginBottom: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Number Type:</label>
          <select
            value={numberType}
            onChange={(e) => setNumberType(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          >
            <option value="p">Prime Numbers</option>
            <option value="f">Fibonacci Numbers</option>
            <option value="e">Even Numbers</option>
            <option value="r">Random Numbers</option>
          </select>
        </div>

        <button 
          onClick={mockFetchNumbers}  
          disabled={loading}
          style={{
            padding: '10px 15px',
            backgroundColor: loading ? '#cccccc' : '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Fetch Numbers'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '15px', backgroundColor: '#ffebee', borderRadius: '4px', color: '#d32f2f' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <h2>Response</h2>
          <div style={{ marginBottom: '15px' }}>
            <p><strong>Previous Window:</strong> {JSON.stringify(handleWindowState(response.windowPrevState))}</p>
            <p><strong>Current Window:</strong> {JSON.stringify(handleWindowState(response.windowCurrState))}</p>
            <p><strong>Numbers Received:</strong> {JSON.stringify(response.numbers)}</p>
            <p><strong>Average:</strong> {calculateAverage(response.numbers)}</p>
          </div>
          <p style={{ color: '#666' }}>
            Window size: {response.windowCurrState?.length || 0}
          </p>
        </div>
      )}

      {!response && !error && !loading && (
        <div style={{ padding: '15px', backgroundColor: '#fff8e1', borderRadius: '4px' }}>
          Click "Fetch Numbers" to get data from the server.
        </div>
      )}
    </div>
  );
};

export default App;
