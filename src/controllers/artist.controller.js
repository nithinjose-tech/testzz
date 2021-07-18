const db = require("../../models");
const Artist = db.artist;
const Op = db.Sequelize.Op;

// Create and Save a new Artist
exports.createArtist = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create an artist
  const artist = {
    name: req.body.name,
    films: req.body.films,
  };

  // Save Artist in the database
  Artist.create(artist)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Artist.",
      });
    });
};

// Retrieve all Artists from the database.
exports.listAllArtist = async (req, res) => {
  const { sort, name, films, sortOrder } = req.query;
  var condition = [
    name ? { name: { [Op.like]: `%${name}%` } } : {},
    films ? { films: { [Op.contains]: [`${films}`] } } : {},
  ];
  const value = sort ? sort : "id";
  const sortOrderValue = sortOrder ? sortOrder : "ASC";
  if ((await value) == "films") {
    res.status(500).send({
      message: "Data cannot be sorted based on films",
    });
  } else {
    Artist.findAll({ where: condition, order: [[value, sortOrderValue]] })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials.",
        });
      });
  }
};

// Find a single Artist with an id
exports.findArtistById = (req, res) => {
  const id = req.params.id;

  Artist.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Artist with id=" + id,
      });
    });
};

// Update a Artist by the id in the request
exports.updateArtistById = (req, res) => {
  const id = req.params.id;

  Artist.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num === 1) {
        res.send({
          message: `Cannot update Artist with id=${id}. Maybe Artist was not found or req.body is empty!`,
        });
      } else {
        res.send({
          message: "Artist was updated successfully.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Artist with id=" + id,
      });
    });
};

// Delete a Artist with the specified id in the request
exports.deleteArtistById = (req, res) => {
  const id = req.params.id;

  Artist.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Artist was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Artist with id=${id}. Maybe Artist was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Artist with id=" + id,
      });
    });
};
