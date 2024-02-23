const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose");
require("dotenv").config();

const homeStartingContent =
  "Welcome to my blog! This is where you can find all the latest updates and articles.";

const aboutContent =
  "I am a passionate web developer who created this project for my learning and to share my knowledge with others. I love exploring new technologies and creating innovative solutions.";

const contactContent =
  "To contact us, please feel free to send an email to <a href='mailto:arunvelv9253@gmail.com'>arunvelv9253@gmail.com</a>. We would love to hear your feedback, suggestions, or any collaboration ideas you may have. You can also connect with us on social media.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = {
  title: String,
  content: String,
};
const Post = mongoose.model("Post", postSchema);

app.get("/", async function (req, res) {
  try {
    // Use await to asynchronously fetch all posts from the database
    const posts = await Post.find({});
    res.render("home", {
      StartingContent: homeStartingContent,
      posts: posts,
    });
  } catch (err) {
    console.error(err);
    // Handle the error appropriately
  }
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", async function (req, res) {
  try {
    const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody,
    });
    await post.save(); // Use await to asynchronously save the post
    res.redirect("/");
  } catch (err) {
    console.error(err);
    // Handle the error appropriately
  }
});

app.get("/posts/:postId", async function (req, res) {
  try {
    const requestedPostId = req.params.postId;

    // Use await to asynchronously find the post in the database by _id
    const post = await Post.findOne({ _id: requestedPostId });

    if (post) {
      res.render("post", {
        title: post.title,
        content: post.content,
      });
    } else {
      // Handle the case where the post is not found
      console.log("Requested Id:", requestedPostId);
      res.send("Post not found");
    }
  } catch (err) {
    console.error(err);
    // Handle the error appropriately
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
