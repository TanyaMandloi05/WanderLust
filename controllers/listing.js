const Listing = require("../models/listing.js");
module.exports.index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}

module.exports.renderNewForm =  (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.showListing = async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you are requesting does not exists!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url, filename};
    await newlisting.save();
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you are requesting does not exists!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image  = {url, filename};
        await listing.save();
    }
    
    req.flash("success", " Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.filter = async(req,res,next)=>{
    let {id} = req.params;
    let allListings = await Listing.find({category: id});
    if(allListings.length != 0){
        res.render("listings/index.ejs", { allListings });
    }else{
        req.flash("error",`No listing with ${id}`);
        res.redirect("/listings")
    }
}


module.exports.destroyListing = async(req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}

module.exports.search = async(req, res) => {
    let { location } = req.query;
  
    const allListings = await Listing.find({ location });
    res.render("./listings/index.ejs", { allListings });
};
