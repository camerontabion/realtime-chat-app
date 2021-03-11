const baseUrl = '/api/auth';

const login = async (authInfo) => {
  const res = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authInfo),
  });
  return res.json();
};

const logout = async () => {
  const res = await fetch(`${baseUrl}/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  return res.json();
};

const authenticate = async () => {
  const res = await fetch(baseUrl, {
    credentials: 'include',
  });
  return res.json();
};

export default { login, logout, authenticate };
