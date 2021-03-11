const baseUrl = '/api/messages';

const getAll = async () => {
  const res = await fetch(baseUrl);
  return res.json();
};

export default { getAll };
