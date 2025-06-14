const express = require ('express')
const app = express()
const path = require('path');
const cors = require('cors');
const userRoutes = require('./routes/users');
const listRoutes = require('./routes/list');
const port = 3000
const clientPath = path.join(__dirname, '..', 'client');
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/teams', listRoutes); 

app.use(express.static(clientPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(clientPath, 'pages', 'index.html'));
});
app.get('/:page', (req, res) => {
    const page = req.params.page + '.html';
    const filePath = path.join(clientPath, 'pages', page);

    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('Page not found');
        }
    });
});

app.listen(port, () =>{
    console.log(`Example app listening on port ${port}`);
})