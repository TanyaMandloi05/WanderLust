const initData = require("./data.js");
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wander_lust";

main()
.then(() => {
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data =  initData.data.map((obj) => ({...obj, owner: "66bef83ec9cc411f47566e15" }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};
  
initDB();