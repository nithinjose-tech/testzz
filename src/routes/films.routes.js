const router = require("express-promise-router")();
const filmController = require("../controllers/films.controller");
const verifyJWT = require("../middleware/verifyJWT");

router.post("/films", verifyJWT, filmController.createFilm);
router.get("/films", verifyJWT, filmController.listAllFilms);
router.get("/films/:id", verifyJWT, filmController.findFilmById);

router.put("/films/:id", verifyJWT, filmController.updateFilmById);

router.delete("/films/:id", verifyJWT, filmController.deleteFilmById);

module.exports = router;
