const express = require('express');
const cors = require('cors');
const eventsRouter = require('./routes/events');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/events', eventsRouter);

app.get('/', (req, res) => {
  res.send({ message: 'Timeline backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
