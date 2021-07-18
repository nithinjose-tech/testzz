const db = require("../../models");
const Users = db.user;
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

// Create and Save a new user
exports.createUser = async (req, res) => {
  const reqObject = JSON.parse(req.data);
  console.log(`Data Field:${reqObject}`);
  console.log(typeof reqObject);
  console.log(reqObject.role);

  if (reqObject.role == "ADMIN") {
    if (!req.body.name) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    // Create an user

    // let hashedPassword = await bcrypt.hash(req.body.password, 8); // Hashing the password

    const user = {
      name: req.body.name,
      role: req.body.role,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 8), // Hashing the password
    };

    // Save user in the database
    if (user.role == "ADMIN" || user.role == "USER") {
      Users.create(user)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the user.",
          });
        });
    } else {
      res.send("Role must be 'ADMIN' or 'USER'");
    }
  } else {
    res.status(401).send({
      message: "Only ADMINS can create new users",
    });
  }
};

// Retrieve all users from the database.
exports.listAllUser = async (req, res) => {
  const {
    pageNumber,
    pageSize,
    sort,
    name,
    role,
    email,
    sortOrder,
  } = req.query;

  const filterQueries = [
    name ? { name: { [Op.like]: `%${name}%` } } : {},
    email ? { email: { [Op.like]: `%${email}%` } } : {},
    role ? { role: { [Op.eq]: `${role}` } } : {},
  ];

  const condition = filterQueries ? filterQueries : " ";

  // var rolecon = role ? { role: { [Op.like]: `%${role}%` } } : null;
  // var emailcon = email ? { email: { [Op.like]: `%${email}%` } } : null;
  console.log(`Condition:${JSON.stringify(condition)}`);

  const { limit, offset } = getPagination(pageNumber, pageSize);
  const value = sort ? sort : "id";
  const sortOrderValue = sortOrder ? sortOrder : "ASC";

  if ((await value) == "password") {
    res.status(500).send({
      message: "Data cannot be sorted based on paasword",
    });
  } else {
    Users.findAndCountAll({
      where: condition,
      limit,
      offset,
      order: [[value, sortOrderValue]],
    })
      .then((data) => {
        const response = getPagingData(data, pageNumber, limit);
        res.send(response);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials.",
        });
      });
  }
};

// Find a single user with an id
exports.findUserById = (req, res) => {
  const id = req.params.id;

  Users.findByPk(id)
    .then((data) => {
      if (data == null) {
        res.status(500).send({
          message: "User does not exist with id=" + id,
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving user with id=" + id,
      });
    });
};

// Update a user by the id in the request
exports.updateUserById = async (req, res) => {
  const id = req.params.id;
  const reqObject = JSON.parse(req.data);
  if (reqObject.role == "ADMIN" || reqObject.id == id) {
    req.body.password = await bcrypt.hash(req.body.password, 8);
    Users.update(req.body, {
      where: { id: id },
    })
      .then((num) => {
        if (num === 1) {
          res.status(400).send({
            message: `Cannot update user with id=${id}. Maybe User was not found or req.body is empty!`,
          });
        } else {
          res.send({
            message: "user was updated successfully.",
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating user with id=" + id,
        });
      });
  } else {
    res.status(401).send({
      message: "You cannot update other's account",
    });
  }
};

// Delete a user with the specified id in the request
exports.deleteUserById = (req, res) => {
  const id = req.params.id;

  Users.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "user was deleted successfully!",
        });
      } else {
        res.status(400).send({
          message: `Cannot delete user with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete user with id=" + id,
        error: console.log(err),
      });
    });
};

exports.authenticateUser = async (req, res) => {
  if (req.body.email === null || req.body.password === null) {
    res.status(500).send({
      message: "email or password is empty",
    });
  }

  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  await Users.findOne({
    where: { email: user.email },
  })
    .then(async (data) => {
      // console.log(`ID:${data.id}`);
      // console.log(`Email:${data.email}`);

      if (await bcrypt.compare(user.password, data.password)) {
        const uniqueID = data.id;
        const emailID = data.email;

        jwt.sign(
          { emailID, uniqueID },
          process.env.secretKey,
          { expiresIn: "1hr" },
          (err, token) => {
            res.json({
              token,
            });
          }
        );
      } else {
        res.status(401).send({
          message: "password is incorrect",
        });
      }
    })
    .catch((error) => {
      res.status(401).send({
        message: "email or password is incorrect",
      });
    });
};

const getPagination = (pageNumber, pageSize) => {
  const limit = pageSize ? +pageSize : 3;
  const offset = pageNumber ? 0 + (pageNumber - 1) * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, pageNumber, pageSize) => {
  const { count: totalElements, rows: results } = data;
  const pagenumber = pageNumber ? +pageNumber : 0;
  const totalPages = Math.ceil(totalElements / pageSize);

  return { pagenumber, pageSize, totalPages, totalElements, results };
};
