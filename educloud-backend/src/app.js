const express = require('express');
const cors = require('cors');
const setRoutes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const swaggerSetup = require('./config/swagger');
const postgresPool = require('./db/postgres');
const mongoDB = require('./db/mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setRoutes(app);
swaggerSetup(app);


app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


