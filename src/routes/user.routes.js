const router = require("express-promise-router")();
const userController = require("../controllers/user.controller");
const verifyJWT = require("../middleware/verifyJWT");

//For adding new Users
router.post("/users", verifyJWT, userController.createUser);

// For finding specific User based on id
router.get("/users/:id", verifyJWT, userController.findUserById);

//For fetching all Users .
router.get("/users", verifyJWT, userController.listAllUser);
// For updating a specific User
router.put("/users/:id", verifyJWT, userController.updateUserById);
//For deleting a specific User
router.delete("/users/:id", verifyJWT, userController.deleteUserById);

//Auth
router.post("/users/login", userController.authenticateUser);

module.exports = router;
