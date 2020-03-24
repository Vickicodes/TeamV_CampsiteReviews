const mongoose   = require("mongoose")
const campsiteSchema = new mongoose.Schema({
    name: String,
    image: String,
    url: String,
    location: String,
    lat: Number,
    lng: Number,
    price: Number,
    description: String,
    createdAt: { type: Date, default: Date.now },
    author: {
      id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User" 
      },
      username: String
   },
   comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
     ]
});

module.exports = mongoose.model("Campsite", campsiteSchema);