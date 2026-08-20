const fs = require("fs");
const path = require("path");
const { driver, verifyConnection } = require("./db");

const people = [
  { id: "p1", name: "Christopher Nolan" },
  { id: "p2", name: "Leonardo DiCaprio" },
  { id: "p3", name: "Christian Bale" },
  { id: "p4", name: "Matthew McConaughey" },
  { id: "p5", name: "Tom Hardy" },
  { id: "p6", name: "Cillian Murphy" },
  { id: "p7", name: "Quentin Tarantino" },
  { id: "p8", name: "Samuel L. Jackson" },
  { id: "p9", name: "Brad Pitt" },
  { id: "p10", name: "Denis Villeneuve" },
  { id: "p11", name: "Timothée Chalamet" },
  { id: "p12", name: "Zendaya" },
];

const movies = [
  {
    id: "m1",
    title: "Inception",
    year: 2010,
    rating: 8.8,
    director: "p1",
    actors: ["p2", "p5", "p6"],
    genres: ["Sci-Fi", "Thriller"],
  },
  {
    id: "m2",
    title: "The Dark Knight",
    year: 2008,
    rating: 9.0,
    director: "p1",
    actors: ["p3", "p6"],
    genres: ["Action", "Crime"],
  },
  {
    id: "m3",
    title: "Interstellar",
    year: 2014,
    rating: 8.7,
    director: "p1",
    actors: ["p4", "p6"],
    genres: ["Sci-Fi", "Drama"],
  },
  {
    id: "m4",
    title: "Dunkirk",
    year: 2017,
    rating: 7.8,
    director: "p1",
    actors: ["p5", "p6"],
    genres: ["War", "Action"],
  },
  {
    id: "m5",
    title: "Oppenheimer",
    year: 2023,
    rating: 8.9,
    director: "p1",
    actors: ["p6", "p3"],
    genres: ["Drama", "History"],
  },
  {
    id: "m6",
    title: "Pulp Fiction",
    year: 1994,
    rating: 8.9,
    director: "p7",
    actors: ["p8", "p9"],
    genres: ["Crime", "Drama"],
  },
  {
    id: "m7",
    title: "Once Upon a Time in Hollywood",
    year: 2019,
    rating: 7.6,
    director: "p7",
    actors: ["p9", "p2"],
    genres: ["Drama", "Comedy"],
  },
  {
    id: "m8",
    title: "Django Unchained",
    year: 2012,
    rating: 8.4,
    director: "p7",
    actors: ["p8", "p2"],
    genres: ["Western", "Drama"],
  },
  {
    id: "m9",
    title: "The Revenant",
    year: 2015,
    rating: 8.0,
    director: "p1",
    actors: ["p2", "p5"],
    genres: ["Adventure", "Drama"],
  },
  {
    id: "m10",
    title: "Dune",
    year: 2021,
    rating: 8.0,
    director: "p10",
    actors: ["p11", "p12"],
    genres: ["Sci-Fi", "Adventure"],
  },
  {
    id: "m11",
    title: "Dune: Part Two",
    year: 2024,
    rating: 8.6,
    director: "p10",
    actors: ["p11", "p12"],
    genres: ["Sci-Fi", "Adventure"],
  },
  {
    id: "m12",
    title: "Blade Runner 2049",
    year: 2017,
    rating: 8.0,
    director: "p10",
    actors: ["p5"],
    genres: ["Sci-Fi", "Thriller"],
  },
  {
    id: "m13",
    title: "Mad Max: Fury Road",
    year: 2015,
    rating: 8.1,
    director: "p10",
    actors: ["p5"],
    genres: ["Action", "Adventure"],
  },
  {
    id: "m14",
    title: "Wolf of Wall Street",
    year: 2013,
    rating: 8.2,
    director: "p7",
    actors: ["p2"],
    genres: ["Comedy", "Drama"],
  },
  {
    id: "m15",
    title: "Batman Begins",
    year: 2005,
    rating: 8.2,
    director: "p1",
    actors: ["p3"],
    genres: ["Action", "Crime"],
  },
].map((movie) => ({
  ...movie,
  posterUrl: `https://placehold.co/600x900/111827/f8fafc?text=${encodeURIComponent(movie.title)}`,
}));

const users = [
  { id: "u1", name: "Ahmed" },
  { id: "u2", name: "Sara" },
  { id: "u3", name: "Omar" },
  { id: "u4", name: "Laila" },
  { id: "u5", name: "Youssef" },
];

const watched = [
  { user: "u1", movie: "m1", rating: 5 },
  { user: "u1", movie: "m2", rating: 5 },
  { user: "u1", movie: "m3", rating: 4 },
  { user: "u2", movie: "m1", rating: 4 },
  { user: "u2", movie: "m10", rating: 5 },
  { user: "u2", movie: "m11", rating: 5 },
  { user: "u3", movie: "m6", rating: 5 },
  { user: "u3", movie: "m7", rating: 4 },
  { user: "u3", movie: "m8", rating: 5 },
  { user: "u4", movie: "m2", rating: 5 },
  { user: "u4", movie: "m15", rating: 4 },
  { user: "u4", movie: "m5", rating: 5 },
  { user: "u5", movie: "m10", rating: 4 },
  { user: "u5", movie: "m12", rating: 5 },
  { user: "u5", movie: "m13", rating: 4 },
  { user: "u1", movie: "m5", rating: 5 },
  { user: "u3", movie: "m14", rating: 4 },
  { user: "u4", movie: "m3", rating: 5 },
];

async function seed() {
  await verifyConnection();
  const session = driver.session();

  try {
    console.log("📐 Applying schema...");
    const schemaCypher = fs.readFileSync(
      path.join(__dirname, "schema.cypher"),
      "utf8",
    );
    const statements = schemaCypher
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("//"));

    for (const stmt of statements) {
      await session.run(stmt);
    }

    console.log("🧹 Clearing old data...");
    await session.run("MATCH (n) DETACH DELETE n");

    console.log("👤 Creating people...");
    for (const p of people) {
      await session.run("CREATE (p:Person {id: $id, name: $name})", {
        id: p.id,
        name: p.name,
      });
    }

    console.log("🎭 Creating genres...");
    const allGenres = [...new Set(movies.flatMap((m) => m.genres))];
    for (const g of allGenres) {
      await session.run("MERGE (g:Genre {name: $name})", { name: g });
    }

    console.log("🎬 Creating movies and relationships...");
    for (const m of movies) {
      await session.run(
        "CREATE (m:Movie {id: $id, title: $title, year: $year, rating: $rating, posterUrl: $posterUrl})",
        {
          id: m.id,
          title: m.title,
          year: m.year,
          rating: m.rating,
          posterUrl: m.posterUrl,
        },
      );

      await session.run(
        `MATCH (p:Person {id: $directorId}), (m:Movie {id: $movieId})
         CREATE (p)-[:DIRECTED]->(m)`,
        { directorId: m.director, movieId: m.id },
      );

      for (const actorId of m.actors) {
        await session.run(
          `MATCH (p:Person {id: $actorId}), (m:Movie {id: $movieId})
           CREATE (p)-[:ACTED_IN]->(m)`,
          { actorId, movieId: m.id },
        );
      }

      for (const genre of m.genres) {
        await session.run(
          `MATCH (m:Movie {id: $movieId}), (g:Genre {name: $genre})
           CREATE (m)-[:IN_GENRE]->(g)`,
          { movieId: m.id, genre },
        );
      }
    }

    console.log("👥 Creating users and watch history...");
    for (const u of users) {
      await session.run("CREATE (u:User {id: $id, name: $name})", {
        id: u.id,
        name: u.name,
      });
    }

    for (const w of watched) {
      await session.run(
        `MATCH (u:User {id: $userId}), (m:Movie {id: $movieId})
         CREATE (u)-[:WATCHED {rating: $rating}]->(m)`,
        { userId: w.user, movieId: w.movie, rating: w.rating },
      );
    }

    console.log("✅ Seed completed successfully!");
    console.log(
      `   ${people.length} people, ${movies.length} movies, ${allGenres.length} genres, ${users.length} users, ${watched.length} watch records`,
    );
  } catch (err) {
    console.error("❌ Seed failed:", err);
  } finally {
    await session.close();
    await driver.close();
  }
}

seed();
