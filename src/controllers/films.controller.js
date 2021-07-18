const db = require("../../models");
const Films = db.Films;
const Op = db.Sequelize.Op;
const user = db.user;

exports.createFilm = (req, res) => {
  // Validate request
  const reqObject = JSON.parse(req.data);
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a film
  const film = {
    name: req.body.name,
    synopsis: req.body.synopsis,
    addedBy: reqObject.id,
  };

  // Save film in the database
  Films.create(film)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(401).send({
        message: err.message || "Some error occurred while creating the Film.",
      });
    });
};

exports.listAllFilms = (req, res) => {
  const { pageNumber, pageSize } = req.query;
  const { limit, offset } = getPagination(pageNumber, pageSize);

  Films.findAndCountAll({
    limit,
    offset,
    include: [
      {
        model: user,
      },
    ],
  })
    .then((data) => {
      const response = getPagingData(data, pageNumber, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Films.",
      });
    });
};

exports.findFilmById = (req, res) => {
  const id = req.params.id;

  Films.findByPk(id, {
    include: [
      {
        model: user,
      },
    ],
  })
    .then((data) => {
      if (data == null) {
        res.status(404).send({
          message: "Film does not exist with id=" + id,
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Film with id=" + id,
      });
    });
};

// Update a film by the id in the request
exports.updateFilmById = (req, res) => {
  const id = req.params.id;

  const film = {
    name: req.body.name,
    synopsis: req.body.synopsis,
  };

  if (req.body.id != id) {
    res.status(409).send({
      message: `id in the body and  request path must be same`,
    });
    return;
  }
  Films.update(film, {
    where: { id: id },
  })
    .then((num) => {
      console.log(`Num:${num}`);

      if (num == 1) {
        // res.send({
        //   message: `Cannot update Film with id=${id}. Maybe Artist was not found or req.body is empty!`,
        // });
        res.send({
          message: "Film was updated successfully.",
        });
      } else {
        // res.send({
        //   message: "Film was updated successfully.",
        // });
        res.status(404).send({
          message: `Cannot update Film with id=${id}.  Film was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error updating Film with id=" + id,
      });
    });
};

// Delete a film with the specified id in the request
exports.deleteFilmById = (req, res) => {
  const id = req.params.id;

  Films.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Film was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Film with id=${id}. Maybe Film was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Film with id=" + id,
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
