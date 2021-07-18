// require() variables
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

//use() configs
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//connect to mongodb
mongoose.connect('mongodb+srv://dbNodeProject:dbpass001@restapidb.tp9t3.mongodb.net/notesDB', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, console.log('Database connected...'))

//data schema
const postSchema = {
  name: String,
  post: String,
};

//data model
const Post = mongoose.model("Post", postSchema);

//read route get request
app.get("/posts", (req, res) => {
  // find post model 
  Post.find()
    // posts => json
    .then((posts) => res.json(posts))
    .catch((err) => res.status(400).json("Error: " + err));
});

//create route post request
app.post("/newpost", (req, res) => {
  // build new post 
  const newPost = new Post({
    name: req.body.name,
    post: req.body.post,
  });
  // save new post 
  newPost.save()
});

//delete route delete request
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  // find and delete post by params id 
  Post.findByIdAndDelete({ _id: id }, (req, res, err) => {
    // check if error 
    if (!err) {
      console.log("Post deleted");
    } else {
      console.log(err);
    }
  });
});

//update route put request by params id
app.put("/put/:id", (req, res) => {
  // build updated post 
  const updatedPost = {
    name: req.body.name,
    post: req.body.post,
  };
  // find post by id and update 
  Post.findByIdAndUpdate(
    // find matching params id
    { _id: req.params.id },
    // set updated post 
    { $set: updatedPost },
    // check for errors 
    (req, res, err) => {
      if (!err) {
        console.log("Post updated");
      } else {
        console.log(err);
      }
    }
  );
});

// server listen / port
app.listen(3001, function () {
  console.log("Server running on port: 3001");
});