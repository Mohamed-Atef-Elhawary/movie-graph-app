const express = require("express");
const router = express.Router();
const { driver } = require("../db");

async function runQuery(cypher, params = {}) {
  const session = driver.session();
  try {
    const result = await session.run(cypher, params);
    return result.records;
  } finally {
    await session.close();
  }
}

router.get("/", async (req, res) => {
  try {
    const records = await runQuery(`
      MATCH (m:Movie)
      OPTIONAL MATCH (d:Person)-[:DIRECTED]->(m)
      OPTIONAL MATCH (m)-[:IN_GENRE]->(g:Genre)
            RETURN m.id AS id, m.title AS title, m.year AS year, m.rating AS rating,
              m.posterUrl AS posterUrl,
             d.name AS director, collect(DISTINCT g.name) AS genres
      ORDER BY m.title
    `);

    const movies = records.map((r) => ({
      id: r.get("id"),
      title: r.get("title"),
      year: r.get("year"),
      rating: r.get("rating"),
      posterUrl: r.get("posterUrl"),
      director: r.get("director"),
      genres: r.get("genres"),
    }));

    res.json(movies);
  } catch (err) {
    console.error(err);
    res
      .status(503)
      .json({ error: "Database unavailable. Please try again later." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const records = await runQuery(
      `
      MATCH (m:Movie {id: $id})
      OPTIONAL MATCH (d:Person)-[:DIRECTED]->(m)
      OPTIONAL MATCH (a:Person)-[:ACTED_IN]->(m)
      OPTIONAL MATCH (m)-[:IN_GENRE]->(g:Genre)
            RETURN m.id AS id, m.title AS title, m.year AS year, m.rating AS rating,
              m.posterUrl AS posterUrl,
             d.name AS director,
             collect(DISTINCT a.name) AS actors,
             collect(DISTINCT g.name) AS genres
    `,
      { id: req.params.id },
    );

    if (records.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const r = records[0];
    res.json({
      id: r.get("id"),
      title: r.get("title"),
      year: r.get("year"),
      rating: r.get("rating"),
      posterUrl: r.get("posterUrl"),
      director: r.get("director"),
      actors: r.get("actors"),
      genres: r.get("genres"),
    });
  } catch (err) {
    console.error(err);
    res
      .status(503)
      .json({ error: "Database unavailable. Please try again later." });
  }
});

router.get("/:id/recommendations", async (req, res) => {
  try {
    const records = await runQuery(
      `
      MATCH (source:Movie {id: $id})

      OPTIONAL MATCH (source)<-[:ACTED_IN|DIRECTED]-(person:Person)-[:ACTED_IN|DIRECTED]->(coCredit:Movie)
      WHERE coCredit.id <> $id

      OPTIONAL MATCH (source)<-[:WATCHED]-(u:User)-[:WATCHED]->(coWatched:Movie)
      WHERE coWatched.id <> $id

      WITH collect(DISTINCT coCredit) + collect(DISTINCT coWatched) AS candidates
      UNWIND candidates AS rec
      WITH DISTINCT rec
      WHERE rec IS NOT NULL
      OPTIONAL MATCH (d:Person)-[:DIRECTED]->(rec)
            RETURN rec.id AS id, rec.title AS title, rec.year AS year,
              rec.rating AS rating, rec.posterUrl AS posterUrl, d.name AS director
      ORDER BY rec.rating DESC
      LIMIT 10
    `,
      { id: req.params.id },
    );

    const recommendations = records.map((r) => ({
      id: r.get("id"),
      title: r.get("title"),
      year: r.get("year"),
      rating: r.get("rating"),
      posterUrl: r.get("posterUrl"),
      director: r.get("director"),
    }));

    res.json(recommendations);
  } catch (err) {
    console.error(err);
    res
      .status(503)
      .json({ error: "Database unavailable. Please try again later." });
  }
});

module.exports = router;
