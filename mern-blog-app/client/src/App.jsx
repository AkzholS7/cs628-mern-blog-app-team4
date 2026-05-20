import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://stunning-fishstick-9wp54jg5x5gc7jjr-5000.app.github.dev/api/posts";

function App() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    author: ""
  });

  const fetchPosts = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setPosts(data);
  };

  const createPost = async (e) => {
    e.preventDefault();

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    setForm({ title: "", content: "", author: "" });
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="app">
      <header>
        <h1>MERN Blog Application</h1>
        <p>Create and view blog posts using React, Express, and MongoDB.</p>
      </header>

      <section className="form-section">
        <h2>Create Blog Post</h2>
        <form onSubmit={createPost}>
          <input
            type="text"
            placeholder="Blog title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <textarea
            placeholder="Blog content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Author name"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            required
          />

          <button type="submit">Publish Post</button>
        </form>
      </section>

      <section className="posts-section">
        <h2>Blog Posts</h2>

        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post) => (
            <div className="post-card" key={post._id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <small>By {post.author}</small>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default App;