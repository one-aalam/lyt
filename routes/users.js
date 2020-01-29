const file = require('../utils/file');

const userRoutes = (app, fs) => {

    // variables
    const dataPath = './data/users.json';

    // READ
    app.get('/users', (req, res) => file.read(data => res.send(data), true, dataPath));

    // CREATE
    app.post('/users', (req, res) => {

        file.read(data => {
            const newUserId = Object.keys(data).length + 1;
            // add the new user
            data[newUserId] = JSON.parse(req.body.data);

            file.write(JSON.stringify(data, null, 2), () => {
                res.status(200).send('new user added');
            }, dataPath);
        },true, dataPath);
    });

    // UPDATE
    app.put('/users/:id', (req, res) => {

        file.read(data => {

            // add the new user
            const userId = req.params["id"];
            data[userId] = JSON.parse(req.body.data);

            file.write(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`users id:${userId} updated`);
            });
        },
            true);
    });

    // DELETE
    app.delete('/users/:id', (req, res) => {

        file.read(data => {

            // add the new user
            const userId = req.params["id"];
            delete data[userId];

            file.write(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`users id:${userId} removed`);
            });
        },
            true);
    });
};

module.exports = userRoutes;