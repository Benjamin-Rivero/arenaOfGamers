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
		first: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		last: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		birthdate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		location: {
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

// app.get("/", (req, res) => {
// 	res.sendFile(path.join(__dirname, "public/index.html"));
// });

// app.get("/contact", (req, res) => {
// 	res.sendFile(path.join(__dirname, "public/contact.html"));
// });

app.post(
	'/contact',
	[
		[
			body('email').isEmail().withMessage('Veuillez rentrer un email'),
			body('subject')
				.notEmpty()
				.withMessage('Veuillez rentrer le sujet de votre message'),
			body('message').notEmpty().withMessage('Veuillez rentrer un message'),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		Contact.create(req.body);
		res.status(200).json({ success: 'Le message a été envoyé avec succès' });
	}
);

app.post(
	'/',
	[
		[
			body('first').notEmpty().withMessage('Veuillez rentrer votre prénom'),
			body('last').notEmpty().withMessage('Veuillez rentrer votre nom'),
			body('email').isEmail().withMessage("L'email doit être valide"),
			body('email').notEmpty().withMessage('Veuillez rentrer votre email'),
			body('birthdate').isDate().withMessage('La date doit être valide'),
			body('birthdate').notEmpty().withMessage('Veuillez rentrer une date'),
			body('birthdate')
				.isBefore(Date.now.toString())
				.withMessage('Veuillez rentrer une date de naissance dans le passé'),
			body('quantity')
				.notEmpty()
				.withMessage(
					'Veuillez rentrer le nombre de tournois auxquels vous avez déjà participé'
				),
			body('location').notEmpty().withMessage('Veuillez indiquer une ville'),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		if (req.body('consent') != true) {
			return res.status(400).json({ error: 'You need to consent to register' });
		}
		Contact.create(req.body);
		res.status(200).json({ success: 'Oui inscrit oui' });
	}
);

app.listen(3000, () => {
	console.log('Serveur démarré sur le port 3000');
});
