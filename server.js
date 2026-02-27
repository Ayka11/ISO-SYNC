import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;
const distPath = path.join(__dirname, 'dist');

app.use(express.static(distPath));

app.get(/.*/, (req, res) => {
  try {
    res.sendFile(path.join(distPath, 'index.html'));
  } catch (err) {
    console.error('Error sending index.html', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
