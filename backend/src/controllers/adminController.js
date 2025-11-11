const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db');
const usersFilePath = path.join(dbPath, 'users.json');
const papersFilePath = path.join(dbPath, 'papers.json');
const guidesFilePath = path.join(dbPath, 'guides.json');

const readUsers = async () => {
    try {
        const data = await fs.readFile(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) { return []; }
};

const writeUsers = async (users) => {
    await fs.mkdir(dbPath, { recursive: true });
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
};

const readJsonFile = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
    const users = await readUsers();
    // Don't send password hashes to the client
    const safeUsers = users.map(({ passwordHash, ...user }) => user);
    res.json(safeUsers);
};

// @desc    Update user subscription
// @route   PUT /api/admin/users/:id/subscription
const updateUserSubscription = async (req, res) => {
    const { id } = req.params;
    const { subscription } = req.body;

    if (!['free', 'pro'].includes(subscription)) {
        return res.status(400).json({ message: 'Invalid subscription status' });
    }

    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    // Admins cannot have their subscription changed
    if(users[userIndex].role === 'admin') {
         return res.status(403).json({ message: 'Cannot change an admin\'s subscription' });
    }

    users[userIndex].subscription = subscription;
    
    // Give credits when upgrading to pro
    if(subscription === 'pro') {
        users[userIndex].aiCredits = 10;
    } else {
        users[userIndex].aiCredits = 0;
    }

    await writeUsers(users);

    const { passwordHash, ...updatedUser } = users[userIndex];
    res.json(updatedUser);
};


// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
const getAdminStats = async (req, res) => {
    try {
        const users = await readUsers();
        const papers = await readJsonFile(papersFilePath);
        const guides = await readJsonFile(guidesFilePath);

        const totalQuestions = papers.reduce((acc, paper) => acc + paper.questions.length, 0);

        res.json({
            users: users.length,
            papers: papers.length,
            questions: totalQuestions,
            guides: guides.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve stats' });
    }
};

// @desc    Delete a past paper
// @route   DELETE /api/admin/papers/:id
const deletePaper = async (req, res) => {
    const { id } = req.params;
    const papers = await readJsonFile(papersFilePath);
    const updatedPapers = papers.filter(p => p.id !== id);

    if (papers.length === updatedPapers.length) {
        return res.status(404).json({ message: 'Paper not found' });
    }

    try {
        await fs.writeFile(papersFilePath, JSON.stringify(updatedPapers, null, 2));
        res.status(200).json({ message: 'Paper deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error writing to database' });
    }
};

// @desc    Delete a study guide
// @route   DELETE /api/admin/guides/:id
const deleteGuide = async (req, res) => {
    const { id } = req.params;
    const guides = await readJsonFile(guidesFilePath);
    const updatedGuides = guides.filter(g => g.id !== id);

    if (guides.length === updatedGuides.length) {
        return res.status(404).json({ message: 'Guide not found' });
    }

    try {
        await fs.writeFile(guidesFilePath, JSON.stringify(updatedGuides, null, 2));
        res.status(200).json({ message: 'Guide deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error writing to database' });
    }
};

module.exports = { getUsers, updateUserSubscription, getAdminStats, deletePaper, deleteGuide };
