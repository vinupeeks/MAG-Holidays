const express = require('express');
const db = require('./app/models');
const cors = require('cors');
require('dotenv').config();

const app = express();
var corsOptions = {
    origin: ["http://localhost:3000"]
};
app.use(cors(corsOptions));
app.use(express.json());


db.sequelize.authenticate()
    .then(() => {
        console.log('Database connected successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

db.sequelize.sync().then(() => {
    console.log('Database synced successfully.');
})
    .catch(err => {
        console.error('Error syncing database:', err);
    });

app.get('/', (req, res) => {
    res.send('Back end is running..!')
})

app.use('/users', require('./app/routes/userRoutes.js'));
app.use('/roles', require('./app/routes/rolesRoutes.js'));
app.use('/leads', require('./app/routes/leadsRoutes.js'));
app.use('/leads/folowup', require('./app/routes/leadsFollowUpRoutes.js'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
