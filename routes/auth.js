const jwt = require('jsonwebtoken')
const jwtKey = 'my_secret_key';
const jwtExpirySeconds = 300;

const file = require('../utils/file');

const apiRoutes = (app) => {

    // variables
    const dataPath = './data/users.json';

    // READ
    app.get('/api/account', (req, res) => {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).end()
        }

        var payload
        try {
            payload = jwt.verify(token, jwtKey)
        } catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                return res.status(401).end()
            }
            return res.status(400).end()
        }
        res.send({
            "id" : 3,
            "login" : "admin",
            "firstName" : "Administrator",
            "lastName" : "Administrator",
            "email" : "admin@localhost",
            "imageUrl" : "",
            "activated" : true,
            "langKey" : "en",
            "createdBy" : "system",
            "createdDate" : null,
            "lastModifiedBy" : "system",
            "lastModifiedDate" : null,
            "authorities" : [ "ROLE_USER", "ROLE_ADMIN" ]
        });
    });

    app.get('/api/account/refresh', (req, res) => {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).end()
        }

        var payload
        try {
            payload = jwt.verify(token, jwtKey)
        } catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                return res.status(401).end()
            }
        return res.status(400).end()
        }

        const nowUnixSeconds = Math.round(Number(new Date()) / 1000)
        if (payload.exp - nowUnixSeconds > 30) {
            return res.status(400).end()
        }

        const newToken = jwt.sign({ username: payload.username }, jwtKey, {
            algorithm: 'HS256',
            expiresIn: jwtExpirySeconds
        })
        res.cookie('token', newToken, { maxAge: jwtExpirySeconds * 1000 })
        res.end()
    });

    // CREATE
    app.post('/api/authenticate', (req, res) => {
        const { username: name, password } = req.body;
        if (!name || !password) {
            return res.status(401).end()
        }
        file.read(data => {
            const [[key, user]] = Object.entries(data).filter(([key, user]) => user.name === name && user.password === password);
            if (!user) {
                return res.status(401).end()
            }
            // Create a new token with the username in the payload
            // and which expires 300 seconds after issue
            const token = jwt.sign({ name }, jwtKey, {
                algorithm: 'HS256',
                expiresIn: jwtExpirySeconds
            })

            // set the cookie as the token string, with a similar max age as the token
            // here, the max age is in milliseconds, so we multiply by 1000
            res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 });
            res.set('Authorization', `Bearer ${token}`);
            res.end()
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

module.exports = apiRoutes;