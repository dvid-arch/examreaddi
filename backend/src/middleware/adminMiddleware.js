const fs = require('fs/promises');
const path = require('path');

const usersFilePath = path.join(__dirname, '..', 'db', 'users.json');

const admin = async (req, res, next) => {
    if (req.user) {
        try {
            const data = await fs.readFile(usersFilePath, 'utf-8');
            const users = JSON.parse(data);
            const user = users.find(u => u.id === req.user.id);

            if (user && user.role === 'admin') {
                next();
            } else {
                res.status(403).json({ message: 'Not authorized as an admin' });
            }
        } catch (error) {
             res.status(500).json({ message: 'Error checking admin status' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized' });
    }
};

module.exports = { admin };
