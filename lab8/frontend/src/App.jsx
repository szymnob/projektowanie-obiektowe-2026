import React, { useState } from 'react';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [registrationUsername, setRegistrationUsername] = useState('');
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [registrationPassword, setRegistrationPassword] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState('');

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
    setRegistrationMessage('');

    const trimmedUsername = registrationUsername.trim();
    const trimmedEmail = registrationEmail.trim();

    if (!trimmedUsername || !trimmedEmail || !registrationPassword) {
      setRegistrationMessage('Uzupełnij wszystkie obowiązkowe pola.');
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setRegistrationMessage('Adres e-mail ma nieprawidłowy format.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: trimmedUsername,
          email: trimmedEmail,
          password: registrationPassword,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setRegistrationMessage('Zarejestrowano pomyślnie!');
        setToken(data.token);
      } else {
        setRegistrationMessage(`Błąd rejestracji: ${data.message || 'Niepowodzenie'}`);
      }
    } catch (err) {
      setRegistrationMessage('Brak połączenia z serwerem Go!');
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ display: 'grid', gap: '24px', maxWidth: '720px' }}>
        <section>
          <h2>Logowanie</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '200px', gap: '10px' }}>
            <input type="text" placeholder="Użytkownik" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Hasło" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Zaloguj</button>
          </form>
          {message && <p><strong>Status:</strong> {message}</p>}
          {token && <p style={{ wordBreak: 'break-all' }}><strong>Token:</strong> {token}</p>}
        </section>

        <section>
          <h2>Rejestracja</h2>
          <form data-testid="registration-form" onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', width: '320px', gap: '10px' }}>
            <input
              data-testid="registration-username"
              type="text"
              placeholder="Użytkownik"
              value={registrationUsername}
              onChange={(e) => setRegistrationUsername(e.target.value)}
            />
            <input
              data-testid="registration-email"
              type="text"
              placeholder="E-mail"
              value={registrationEmail}
              onChange={(e) => setRegistrationEmail(e.target.value)}
            />
            <input
              data-testid="registration-password"
              type="password"
              placeholder="Hasło"
              value={registrationPassword}
              onChange={(e) => setRegistrationPassword(e.target.value)}
            />
            <button data-testid="registration-submit" type="submit">Zarejestruj</button>
          </form>
          {registrationMessage && <p data-testid="registration-status"><strong>Status rejestracji:</strong> {registrationMessage}</p>}
        </section>
      </div>
    </div>
  );
}

export default App;