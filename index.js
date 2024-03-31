const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
};
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const contentCollection = client.db("wikitainmentDB").collection("content");
    const watchCollection = client.db("wikitainmentDB").collection("watchList");

// Add Content to the collection
    app.post("/content", async (req, res) => {
        const addContent = req.body;
        const result = await contentCollection.insertOne(addContent);
        res.send(result);
      });
// show content by email address filter from the collection
      app.get("/my-listing-content", async (req, res) => {
        let query = {};
        if (req.query?.email) {
          query = { UploaderEmail: req.query.email };
        }
        const result = await contentCollection.find(query).toArray();
        res.send(result);
      });
// delete content from collection by id
      app.delete("/my-listing-content-delete/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await contentCollection.deleteOne(query);
        res.send(result);
      });
// show content by _id filter from the collection
      app.get("/my-listing-content-one/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await contentCollection.findOne(query);
        res.send(result);
      });
  // edit content by _id filter from the collection
      app.put("/my-listing-content-edit/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updateContent = req.body;
        const content = {
          $set: {
             contentName : updateContent.contentName,
             contentReleased : updateContent.contentReleased,
             contentGenre : updateContent.contentGenre,
             contentCategory : updateContent.contentCategory,
             contentRating : updateContent.contentRating,
             contentRuntime : updateContent.contentRuntime,
             contentWriter : updateContent.contentWriter,
             contentDirector : updateContent.contentDirector,
             contentPoster : updateContent.contentPoster,
             contentTrailer : updateContent.contentTrailer,
             contentSource : updateContent.contentSource,
             contentPlot  : updateContent.contentPlot,
             contentCast : updateContent.contentCast
          },
        };
        const result = await contentCollection.updateOne(
          filter,
          content,
          options
        );
        res.send(result);
      });
  // show content by category filter from the collection
      app.get("/content/:contentCategory", async (req, res) => {
        const contentCategory= req.params.contentCategory;
        const query = { contentCategory: contentCategory };
        const FindData = await contentCollection.find(query);
        const result = await FindData.toArray();
        res.send(result);
      });
// send data for watchlist collection
      app.post("/watchlist-collection", async (req, res) => {
        const WatchlistData  = req.body;
        const result = await watchCollection.insertOne(WatchlistData);
        res.send(result);
      });
// filter and show data from watchlist collection by email
      app.get("/my-watchlist-collection", async (req, res) => {
        let query = {};
        if (req.query?.email) {
          query = { email: req.query.email };
        }
        const result = await watchCollection.find(query).toArray();
        res.send(result);
      });
// delete one by id from watchlist collection
      app.delete("/my-single-watchlist-delete/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await watchCollection.deleteOne(query);
        res.send(result);
      });

    

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {

  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome To My Server");
});

app.listen(port, () => {
  console.log(`listening on port , ${port}`);
});
