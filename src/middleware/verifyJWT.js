var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require("../../models");
const Users = db.user;

dotenv.config();
const verifyJWT = async (req, res, next) => {
  const token = req.headers["authorization"];
  console.log(token);
  console.log("hey");

  if (!token) {
    console.log("Auth Failed");
    res.status(400).send({
      message: "Auth token was not provided",
    });
  } else {
    jwt.verify(token, process.env.secretKey, async (err, decoded) => {
      if (err) {
        console.log(`Real error:${err}`);
        res.json({ auth: false, message: "Failed to Authenticated" });
      } else {
        // console.log("Decided Value");
        // console.log(JSON.stringify(decoded));
        // console.log(`UniqueID:${decoded.uniqueID}`);
        const uniqueid = decoded.uniqueID;

        Users.findOne({
          where: { id: uniqueid },
        }).then((userObject) => {
          // console.log(`Data:${userObject.role}`);
          const loggedUser = JSON.stringify(userObject);
          // console.log(`Data:${loggedUser}`);
          req.data = loggedUser;
          // console.log(`Req.data=${req.data}`);
          next();
        });
      }
    });
  }
};

module.exports = verifyJWT;
