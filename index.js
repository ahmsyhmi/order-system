const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const dotenv = require('dotenv');
dotenv.config();
app.use(cors());    


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});