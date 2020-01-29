const file = require('../utils/file');

const userRoutes = (app) => {

    // variables
    const dataPath = './data/users.json';

    // READ
    app.get('/users', (_, res) => file.read(data => res.send(data), true, dataPath));

    // CREATE
    app.post('/users', (req, res) => {
        file.read(data => {
            const newUserId = Object.keys(data).length + 1;
            data[newUserId] = req.body;
            file.write(JSON.stringify(data, null, 2), () => res.status(200).send(`new user ${newUserId} added`), dataPath);
        },true, dataPath);
    });

    // UPDATE
    app.put('/users/:id', (req, res) => {
        file.read(data => {
            const userId = req.params["id"];
            data[userId] = req.body;
            file.write(JSON.stringify(data, null, 2), () => res.status(200).send(`users id:${userId} updated`), dataPath);
        }, true, dataPath);
    });

    // DELETE
    app.delete('/users/:id', (req, res) => {
        file.read(data => {
            const userId = req.params["id"];
            delete data[userId];
            file.write(JSON.stringify(data, null, 2), () => res.status(200).send(`users id:${userId} removed`), dataPath);
        }, true, dataPath);
    });
};

module.exports = userRoutes;