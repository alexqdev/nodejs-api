// npx install create-react-app myApp
// npm init 
// npm install express mongoose axios cors bootstrap react-bootstrap-icons uuid
// package.json => "proxy": "http://localhost:3001",
// clear cra defaults
// make server.js =>

// imports 
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Icon from 'react-bootstrap-icons';
import "./styles.css";

function App() { 
  // posts state - arr of objs
  const [posts, setPosts] = useState([
    {
      name: "",
      post: "",
      _id: "",
    },
  ]);

  // post state - obj 
  const [post, setPost] = useState({
    name: "",
    post: "",
  });

  // is put check state 
  const [isPut, setIsPut] = useState(false);

  // post update btn check state 
  const [isPostUpdate, setIsPostUpdate] = useState(false);

  // updated post state - obj 
  const [updatedPost, setUpdatedPost] = useState({
    name: "",
    post: "",
    id: "",
  });

  // useEffect to fetch data
  useEffect(() => {
    // fetch posts data 
    fetch("/posts")
      .then((res) => {
        if (res.ok) {
          // return posts json
          return res.json();
        }
      })
      // set posts 
      .then((jsonRes) => setPosts(jsonRes))
      .catch((err) => console.log(err));
  }, [posts]);

  // useEffect to render default html 
  useEffect(()=>{
    setIsPut(false);
  },[isPostUpdate])

  // track input values
  function handleChange(event) {
    const { name, value } = event.target;
    // set post to tracked input values
    setPost((prevInput) => {
      // return previous input + current input
      return {
        ...prevInput,
        [name]: value,
      };
    });
  }

  // add post event 
  function addPost(event) {
    event.preventDefault();
    // check inputs != empty
    if (post.name != "" && post.post != "") {
      // build new post w/ ui data
      const newPost = {
        name: post.name,
        post: post.post,
      };
      // axios post new post to server route
      axios.post("/newpost", newPost);

      // clear post 
      setPost({
        name: "",
        post: "",
      });
    } else {
      // alert empty input 
      alert('Inputs cannot be empty.')
    }
  }

  // delete post by id event
  function deletePost(id) {
    // axios delete route + passed id 
    axios.delete("/delete/" + id);
  }

  // display update html 
  function openUpdate(id) {
    // set is put to true to display update html
    setIsPut(true);

    // set updated post to tracked input values*
    setUpdatedPost((prevInput) => {
      return {
        ...prevInput,
        id: id,
      };
    });
  }

  // update post event 
  function updatePost(id) {
    // axios put updated post to server route + passed id
    axios.put("/put/" + id, updatedPost);
    setIsPostUpdate(true);
    setUpdatedPost({
      name:"",
      post:""
    })
    setTimeout(() => {
      setIsPostUpdate(false);
    }, 3000);
  }

  // track input values 
  function handleUpdate(event) {
    const { name, value } = event.target;
    // set updated post to tracked input values 
    setUpdatedPost((prevInput) => {
      // return previous input + current input
      return {
        ...prevInput,
        [name]: value,
      };
    });
  }
  return (
    <div className="App container">
      <div className='container text-center home'>
        <h3>Create/Retrieve/Update/Delete to/from Database<br /><Icon.ArrowDown /></h3>
      </div>
      {!isPut ? (
        <div className="main container">
          <input
            id="postName"
            onChange={handleChange}
            name="name"
            value={post.name}
            placeholder="name"
          ></input>
          <input
            id="postPost"
            onChange={handleChange}
            name="post"
            value={post.post}
            placeholder="post"
          ></input>
          <button className="btn btn-lg btn-info" onClick={addPost}>
            ADD POST
          </button>
        </div>
      ) : (
        <div className="main container">
          <input
            id="postName"
            onChange={handleUpdate}
            name="name"
            value={updatedPost.name}
            placeholder="name"
          ></input>
          <input
            id="postPost"
            onChange={handleUpdate}
            name="post"
            value={updatedPost.post}
            placeholder="post"
          ></input>
          <button className="btn btn-lg btn-warning" onClick={() => updatePost(updatedPost.id)}>
            UPDATE POST
          </button>
          <button className="btn btn-lg btn-secondary" onClick={() => window.location.reload()}>CANCEL</button>
        </div>
      )}
      <div id="posts" className="container">
        {/* map posts info - build / display HTML */}
        {posts.map((post) => {
          return (
            <div className="post container" key={post._id}>
              <span className="postBtns">
                <Icon.Pencil className="postBtn" cursor="pointer" color="yellow" onClick={() => openUpdate(post._id)} />
                <Icon.Trash className="postBtn" cursor="pointer" color="red" onClick={() => deletePost(post._id)} />
              </span>
              <p>{post.name}</p>
              <p>{post.post}</p>
            </div>
          );
        }).reverse()}
      </div>
    </div>
  );
}

export default App;