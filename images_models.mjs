import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);

// Connect to to the database
const db = mongoose.connection;
/**
 * Define the schema
 */
const imageSchema = mongoose.Schema({
    fileName: { type: String, required: true }
});

/**
 * Compile the model from the schema. This must be done after defining the schema.
 */
const Image = mongoose.model("image", imageSchema);

/**
 * 
 * @param {String} fileName 
 * @returns 
 */
const createImage = async(fileName) => {
    const image = new Image({fileName: fileName});
    return image.save(); // persistent this image instance to Mongodb
}


const getRandomImage = async() => {
    const item = await Image.aggregate([
        { $sample: {
            size: 1
        }}
    ])
    return item;
}

const findImages = async (filter, projection, limit) => {
    const query = Image.find(filter)
        .select(projection)
        .limit(limit)
    return query.exec();
}

const findImageById = async (_id) => {
    const query = Image.findById(_id); // static method
    return query.exec();
}


const deleteById = async(_id) => {
    const result = await Image.deleteOne({_id: _id});
    return result.deletedCount;
}

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

export{createImage, getRandomImage, findImages, findImageById, deleteById};