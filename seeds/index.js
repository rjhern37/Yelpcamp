const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../model/campground');
const dotenv = require('dotenv').config();

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 450; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			author: '60997600f361e81c9a4d28d9',
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
			price,
			geometry: {
				type: 'Point',
				coordinates: [ cities[random1000].longitude, cities[random1000].latitude ]
			},
			images: [
				{
					url:
						'https://res.cloudinary.com/daftpunk132/image/upload/v1620930513/Yelpcamp/voivzmrfottjdhy1rcch.jpg',
					filename: 'Yelpcamp/voivzmrfottjdhy1rcch'
				},
				{
					url:
						'https://res.cloudinary.com/daftpunk132/image/upload/v1620930313/Yelpcamp/ommcdbbrjngnsouzs64z.jpg',
					filename: 'Yelpcamp/ommcdbbrjngnsouzs64z'
				}
			]
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
