const baseUrl = '/api/channels';

const get = async (id) => {
  const res = await fetch(`${baseUrl}/${id}`);
  return res.json();
};

const create = async (name) => {
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  return res.json();
};

const join = async (id) => {
  const res = await fetch(`${baseUrl}/join/${id}`, {
    method: 'PUT',
  });
  return res.json();
};

export default { get, create, join };
