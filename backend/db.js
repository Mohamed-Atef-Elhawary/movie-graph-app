const neo4j = require("neo4j-driver");
require("dotenv").config();

const driver = neo4j.driver(
  process.env.COGNODB_URI,
  neo4j.auth.basic(process.env.COGNODB_USER, process.env.COGNODB_PASSWORD),
);

async function verifyConnection() {
  try {
    await driver.verifyConnectivity();
    console.log("✅ Connected to CognoDB successfully");
  } catch (err) {
    console.error("❌ Failed to connect to CognoDB:", err.message);
    process.exit(1);
  }
}

module.exports = { driver, verifyConnection };
