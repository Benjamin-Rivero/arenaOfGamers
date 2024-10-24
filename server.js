const http = require('http');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const express = require('express');
const app = express();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('db_arena', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

const User = sequelize.define(
    'User',
    {
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prenom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dateNaissance: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        nbParticipationTournoi: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tournoiWish: {
            type: DataTypes.ENUM,
            values: [
                'New York',
                'San Francisco',
                'Seattle',
                'Chicago',
                'Boston',
                'Portland',
            ],
        },
        newsletter: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        timestamps: true,
    }
);

const Contact = sequelize.define(
    'Contact',
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: true,
    }
);

sequelize.sync().then(() => {
    console.log('Base de données synchronisée');
});

// Express.js middleware to use JSON objects
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// app.get('/contact', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public/contact.html'));
// });

app.post(
    '/contact',
    // using validation to verify valid inputs (MIDDLEWARE)
    [
        [
            body('email').isEmail(),
            body('subject').notEmpty(),
            body('message').notEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        Contact.create(req.body);
        res.status(200).json({ success: 'Successful Sign Up!' });
    }
);

app.listen(3000, () => {
    console.log('Serveur démarré sur le port 3000');
});
