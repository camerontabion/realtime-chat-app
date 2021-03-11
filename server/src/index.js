import http from './app.js';

const PORT = process.env.PORT || 3001;

http.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
