require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;

/* ================= JWT MIDDLEWARE ================= */
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

/* ================= LOGIN ================= */
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      if (result.length === 0)
        return res.status(401).json({ message: 'Invalid email' });

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res.status(401).json({ message: 'Invalid password' });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({
        token,
        user: { id: user.id, name: user.name, role: user.role }
      });
    }
  );
});

/* ================= DASHBOARD ================= */
app.get('/api/dashboard', auth, (req, res) => {
  db.query('SELECT * FROM dashboard_stats', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get('/api/dashboard/recent', auth, (req, res) => {
  db.query(
    'SELECT * FROM employees ORDER BY id DESC LIMIT 5',
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

/* ================= EMPLOYEES ================= */
app.get('/api/employees', auth, (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 5);
  const search = req.query.search || '';
  const offset = (page - 1) * limit;

  db.query(
    `SELECT * FROM employees WHERE name LIKE ? LIMIT ? OFFSET ?`,
    [`%${search}%`, limit, offset],
    (err, result) => {
      if (err) return res.status(500).json(err);

      db.query(
        'SELECT COUNT(*) AS total FROM employees WHERE name LIKE ?',
        [`%${search}%`],
        (err, count) => {
          res.json({
            data: result,
            total: count[0].total,
            page,
            limit
          });
        }
      );
    }
  );
});

app.get('/api/employees/:id', auth, (req, res) => {
  db.query(
    'SELECT * FROM employees WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (result.length === 0)
        return res.status(404).json({ message: 'Employee not found' });
      res.json(result[0]);
    }
  );
});

app.post('/api/employees', auth, (req, res) => {
  const { name, email, department, role } = req.body;
  db.query(
    'INSERT INTO employees (name,email,department,role) VALUES (?,?,?,?)',
    [name, email, department, role],
    () => res.json({ message: 'Employee added' })
  );
});

app.put('/api/employees/:id', auth, (req, res) => {
  const { name, email, department, role } = req.body;
  db.query(
    'UPDATE employees SET name=?,email=?,department=?,role=? WHERE id=?',
    [name, email, department, role, req.params.id],
    () => res.json({ message: 'Employee updated' })
  );
});

app.delete('/api/employees/:id', auth, (req, res) => {
  db.query(
    'DELETE FROM employees WHERE id=?',
    [req.params.id],
    () => res.json({ message: 'Employee deleted' })
  );
});

/* ================= SERVER ================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
