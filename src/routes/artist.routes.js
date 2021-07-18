const router = require("express-promise-router")();
const artistController = require("../controllers/artist.controller");
const verifyJWT = require("../middleware/verifyJWT");

//For adding new artists
router.post("/artists", verifyJWT, artistController.createArtist);

// For finding specific artist based on id
router.get("/artists/:id", verifyJWT, artistController.findArtistById);

//For fetching all artists .
router.get("/artists", verifyJWT, artistController.listAllArtist);
// For updating a specific artist
router.put("/artists/:id", verifyJWT, artistController.updateArtistById);
//For deleting a specific artist
router.delete("/artists/:id", verifyJWT, artistController.deleteArtistById);

module.exports = router;
