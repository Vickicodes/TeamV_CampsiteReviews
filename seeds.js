var mongoose = require("mongoose");
var Campsite = require("./models/campsite");
var Comment   = require("./models/comment");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);
 
var data = [
    {
        name: "Nine Wells Caravan and Camping",
        image: "https://images.squarespace-cdn.com/content/v1/54a92ea2e4b0d6033e4bbdbb/1420378787409-XH40TDJ6M5HRNZ3BAHN3/ke17ZwdGBToddI8pDm48kDHPSfPanjkWqhH6pl6g5ph7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0mwONMR1ELp49Lyc52iWr5dNb1QJw9casjKdtTg1_-y4jz4ptJBmI9gQmbjSQnNGng/IMG_0878.JPG",
        url: "https://www.ninewellscamping.com/",
        location: "Solva, St Davids, Haverfordwest SA62 6UH",
        price: 17.00,
        description: "The site is approximately 5 minutes walk through a picturesque valley to the secluded cove of Porth-y-Rhaw, with its impressive Iron Age fort, fossils, and proximity to the coastal footpath. It is a fantastic place stop off if you are intending to walk a part or all of the coast. The site is 4.15 acres and licensed for 30 caravans, plus tents, including 8 electric hookup pitches. The shower block and toilets have been recently refurbished. Hot water and showers are free. Dogs are welcome but they must be kept on a lead at all times and exercised away from the site. There are electric points in the shower block to charge phones, laptops etc. There is a request bus stop near the entrance to the site which is served by the 'Puffin Shuttle' and the 411 service.",
        author:{
            id : "588c2e092403d111454fff76",
            username: "Jack"
        },
    },
    {    
        name: "fishguard bay caravan & camping park",
        image: "https://www.fishguardbay.com/media/1485/needle-rock-view-features-banner.jpg",
        url: "https://www.fishguardbay.com/",
        location: "Bay Resort, Fishguard, Newport SA64 9ET",
        price: 23.00,
        description: "Perched on a magical spot on the unspoilt western coast of Wales between the big sky and the briny sea, where the cliffs plunge to the golden sands and smugglers’ coves below, our Fishguard Bay Resort has been described as ‘nothing less than a little piece of heaven on earth,’ a unique pocket of paradise where you can leave the world behind, relax, recharge, rejuvenate and quietly blow the dust from your soul. Unwind in unrivalled luxury for an unforgettable stay, cared for by our friendly, professional staff for whom nothing is too much trouble. Whether you choose from our stunning range of luxury lodges, our static caravans or our cute and cosy glamping pods, or whether you decide to take advantage of our intimate touring and camping site you will be assured of only the very highest standards. But whatever your choice, we pride ourselves on providing you with a home-from-home, stylish and modern, blended seamlessly into the surrounding landscape. Stretching out behind the Fishguard Bay Resort the whole of Pembrokeshire will become your playground, and it’s a playground that really does have something for everyone. Whisper it quietly but here you’ll discover some of the finest beaches on the planet, not to mention the 186-mile coast path, just a pebble’s throw away, lined with gorse and wild flowers. Throughout the county you’ll find every form of outdoor activity known to man, as well as adventure parks, theatres, cinemas, boat excursions, fabulous places to eat and beautiful towns and villages to explore. If you simply want to relish the history that permeates every Pembrokeshire inch, you could wander across the heather-brushed Preseli Hills and find the source of the famous Stonehenge bluestones, marvel at the birthplace of the first Tudor king Henry VII, Pembroke Castle, or the equally iconic cathedral at St Davids, Britain’s most compact and bijou city. Then there are the particular delights of the ancient burial stones at Pentre Ifan, always lonely, forever buffeted by the wind. In short, there’s so much to see and so much to do.",
        author:{
            id : "588c2e092403d111454fff76",
            username: "Jack"
        },
    },
    {
        name: "Camping La Grappe D'or, Meursault",
        image: "https://www.camping-meursault.com/uploads/sites/14/2018/04/camping_grappe_d_or_mersault_emplacements_vignes.jpg",
        url: "https://www.camping-meursault.com/en/",
        location: "Meursault, France",
        price: 25.00,
        description: "Camp in the heart of the Burgundian vineyards, in Meursault. Open from 03/04/2020 to 01/11/2020. The entire team at the Huttopia Meursault camp site is ready to welcome you to a scenic, treed 5ha site. From April to October come and relax and enjoy the vine filled landscape. The perfect environment to rest and relax! Whether your stay with us is a relaxing stopover for the night or you’re in Burgundy to discover the many treasures of the region, you will find tranquillity, beautiful scenery and culinary adventures. The campsite is situated on the road to Southern France, 10 minutes from the A6 motorway exit.",
        author:{
            id : "588c2e092403d111454fff76",
            username: "Jack"
        },
    },
    {
        name: "Huttopia Royat Campsite ****",
        image: "https://europe.huttopia.com/content/uploads/2016/11/Huttopia-Royat-allee.jpg",
        url: "https://europe.huttopia.com/en/site/royat/#accueil-royat",
        location: "Route de Gravenoire, 63130 Royat",
        price: 20.00,
        description: "Huttopia Royat campsite is ideal for relaxing after a busy day out exploring just a stone’s throw from the most beautiful spots in the Auvergne. After a day of hiking and sightseeing in the midst of nature, holidaymakers will appreciated the campsite’s heated pool and jacuzzi. On site: a tennis court, restaurant service, and activity programme for children and adults, as well as bright, brand new washroom facilities to make your holidays even easier.",
        author:{
            id : "588c2e092403d111454fff76",
            username: "Jack"
        },
    },
    {
        name: "Druidston Home Farm Campsite",
        image: "https://static.wixstatic.com/media/37774a_a448c39a9eec43599f242cc3de47915f~mv2_d_4864_2736_s_4_2.jpg",
        url: "https://www.druidstonhomefarm.co.uk/",
        location: "Broad Haven, Haverfordwest SA62 3NE",
        price: 20.00,
        description: "We are set in 4 acres of glorious Pembrokeshire countryside, it is a small, peaceful, family run campsite, with beautiful panoramic views over St Brides Bay to St David's and the Preseli Hills with glorious sunsets.",
        author:{
            id : "588c2e092403d111454fff76",
            username: "Jack"
        },
    },
    {
        name: "Campasun Aigle - 3 star campsite",
        image: "https://www.campasun.eu/aigle/wp-content/uploads/sites/5/2019/04/campasun-de-l-aigle.jpg",
        url: "https://www.campasun.eu/aigle/",
        location: "Aiguines, France",
        price: 20.00,
        description: "Campsite with view of the Lac de Sainte Croix in Aiguines, in the Verdon. At the gates of the Gorges du Verdon  and perched above the  Lac de Sainte Croix , the 3-star Camping de l'Aigle, a  2-minute walk from the village of Aiguines, invites  you to stay or eat in a magical setting. From dawn to dusk, you will enjoy a  fantastic panorama  and an extraordinary view of the lake of Ste Croix, which make this place unforgettable and awe-inspiring. Facing the Plateau de Valensole and the Moustiers Valley , Camping de l'Aigle offers you a stay in the great outdoors in the Gorges du Verdon, your eyes riveted on superb landscapes, in  a warm and family atmosphere.",
        author:{
            id : "588c2e092403d111454fff76",
            username: "Jack"
        },
    }
]
 
function seedDB(){
   //Remove all campsites
   Campsite.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campsites!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
            //  add a few campsites
            data.forEach(function(seed){
                var name = seed.name;
                var image = seed.image;
                var url = seed.url;
                var price = seed.price;
                var description = seed.description;
                var author = seed.author;

                geocoder.geocode(seed.location, function (err, data) {
                    if (err || !data.length) {
                    console.log(err)
                    }

                    var lat = data[0].latitude;
                    var lng = data[0].longitude;
                    var location = data[0].formattedAddress;

                    // add to campsites db
                    var newCampsite = {name: name, image: image, url: url, description: description, location: location, lat: lat, lng: lng, price: price, author: author}
                    Campsite.create(newCampsite, function(err, newlyCreated){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a campsite");
                        // //create a comment
                        // Comment.create(
                        //     {
                        //         text: "This place is great, but I wish there was internet",
                        //         author: "Homer"
                        //     }, function(err, comment){
                        //         if(err){
                        //             console.log(err);
                        //         } else {
                        //             campsite.comments.push(comment);
                        //             campsite.save();
                        //             console.log("Created new comment");
                        //         }
                        // });
                    }
                });
            });
        });
    }); 
});
}
 
module.exports = seedDB;