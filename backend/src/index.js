const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes.js');
const dataRoutes = require('./routes/dataRoutes.js');
const aiRoutes = require('./routes/aiRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('ExamRedi Backend is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
