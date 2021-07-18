const bcrypt = require("bcryptjs");
("use strict");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("users", [
      {
        name: "Vinayak",
        role: "ADMIN",
        email: "vinayak@gmail.com",
        password: await bcrypt.hash("1234", 8),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
