import app from './server';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 RiseTogether Backend Server running locally on http://localhost:${PORT}`);
});
