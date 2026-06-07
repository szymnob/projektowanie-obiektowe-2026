import React, { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setToken('');

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Zalogowano pomyślnie!');
        setToken(data.token);
      } else {
        setMessage(`Błąd: ${data.message || 'Nieudane logowanie'}`);
      }
    } catch (err) {
      setMessage('Brak połączenia z serwerem Go!');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setMessage('Zarejestrowano pomyślnie!');
        setToken(data.token);
      } else {
        setMessage(`Błąd rejestracji: ${data.message || 'Niepowodzenie'}`);
      }
    } catch (err) {
      setMessage('Brak połączenia z serwerem Go!');
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h2>Logowanie</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '200px', gap: '10px' }}>
        <input type="text" placeholder="Użytkownik" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Hasło" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Zaloguj</button>
        <button type="button" onClick={handleRegister}>Zarejestruj</button>
      </form>
      {message && <p><strong>Status:</strong> {message}</p>}
      {token && <p style={{ wordBreak: 'break-all' }}><strong>Token:</strong> {token}</p>}
    </div>
  );
}

export default App;