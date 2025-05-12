import React, { useState } from 'react';

const App = () => {
  const [numberType, setNumberType] = useState('p');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNumbers = async () => {
    setLoading(true);
    setError(null);
    console.log('Starting fetch...'); // Debug log
    
    try {
      const url = `http://localhost:9876/numbers/${numberType}`;
      console.log('Fetching from:', url); // Debug log
      
      const startTime = Date.now();
      const res = await fetch(url);
      const fetchDuration = Date.now() - startTime;
      
      console.log('Fetch completed in:', fetchDuration, 'ms'); // Debug log
      
      if (!res.ok) {
        const errorData = await res.text();
        console.error('Server response error:', errorData); // Debug log
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Received data:', data); // Debug log
      setResponse(data);
      
    } catch (err) {
      console.error('Fetch error:', err); // Debug log
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Average Calculator Microservice</h1>
      
      <div style={{ 
        padding: '20px', 
        marginBottom: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px'
      }}>
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
          onClick={fetchNumbers}
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
        <div style={{ 
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#ffebee',
          borderRadius: '4px',
          color: '#d32f2f'
        }}>
          <strong>Error:</strong> {error}
          <p style={{ marginTop: '10px', fontSize: '0.9em' }}>
            Check if the server is running at http://localhost:9876
          </p>
        </div>
      )}

      {response && (
        <div style={{ 
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px'
        }}>
          <h2 style={{ marginBottom: '15px' }}>Response</h2>
          <div style={{ marginBottom: '15px' }}>
            <p><strong>Previous Window:</strong> {JSON.stringify(response.windowPrevState)}</p>
            <p><strong>Current Window:</strong> {JSON.stringify(response.windowCurrState)}</p>
            <p><strong>Numbers Received:</strong> {JSON.stringify(response.numbers)}</p>
            <p><strong>Average:</strong> {response.avg?.toFixed(2)}</p>
          </div>
          <p style={{ color: '#666' }}>
            Window size: {response.windowCurrState?.length || 0}
          </p>
        </div>
      )}
      
      {!response && !error && !loading && (
        <div style={{ 
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#fff8e1',
          borderRadius: '4px'
        }}>
          Click "Fetch Numbers" to get data from the server
        </div>
      )}
    </div>
  );
};

export default App;