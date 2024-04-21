const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("Test", (m) => {
  console.log("Hi!")

});
