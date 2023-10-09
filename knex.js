const express = require('express');
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'faressoudani',
        database: 'assignment_4',
    },
});

const app = express();
app.use(express.json());

// Create a new user
app.post('/users', async (req, res) => {
    try {
        const { name, email } = req.body;
        const [newUser] = await knex('users')
            .returning(['id', 'name', 'email'])
            .insert({ name, email });
        res.json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Retrieve users by name or email using queries
app.get('/users', async (req, res) => {
    try {
        const { queryParam } = req.query;
        const users = await knex('users')
            .select('*')
            .where('name', 'like', `%${queryParam}%`)
            .orWhere('email', 'like', `%${queryParam}%`);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a user by ID
app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const updatedUser = await knex('users')
            .where({ id })
            .update({ name, email }, ['id', 'name', 'email']);
        if (updatedUser.length > 0) {
            res.json(updatedUser[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await knex('users')
            .where({ id })
            .del(['id', 'name', 'email']);
        if (deletedUser.length > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
