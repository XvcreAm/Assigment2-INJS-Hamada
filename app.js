const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('./users.json');
const teachers = require('./teachers.json');

const app = express();

app.use(express.json());


const secretKey = 'secret';


app.post('/login', (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const user = users.find(u => u.username === req.body.username && u.password === req.body.password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, secretKey);

  res.status(200).json({ token });
});


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization header is missing.' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }

    req.user = user;
    next();
  });
}

app.get('/teachers', authenticateToken, (req, res) => {
  res.status(200).json({ teachers });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
