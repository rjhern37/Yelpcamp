const mongoose = require('mongoose');
const Review = require('./review');
const { schema } = require('./user');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
	title: String,
	image: String,
	price: Number,
	description: String,
	location: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	]
});

CampgroundSchema.post('findOneAndDelete', async function(doc) {
	//if there is a document passed in
	if (doc) {
		//Id for each review is $in doc.reviews
		await Review.deleteMany({
			_id: {
				$in: doc.reviews
			}
		});
	}
});

module.exports = mongoose.model('Campground', CampgroundSchema);
