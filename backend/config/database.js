const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        //Disable warning for mongoose
        mongoose.set("strictQuery", false);

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
    }
};

/**
* MongoDB connectivity function 
*/
module.exports = connectDB;
