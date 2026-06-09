import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  "https://reimagined-sniffle-p9xwqp5w97vhrrpg-5000.app.github.dev/api/posts";

const CHAT_API_URL =
  "https://reimagined-sniffle-p9xwqp5w97vhrrpg-5000.app.github.dev/api/chat";

function App() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    author: ""
  });

  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I am your AI Blog Assistant powered by Gemini. I can help with blog ideas, titles, summaries, and MERN stack questions."
    }
  ]);

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

  const deletePost = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();

    if (!chatInput.trim()) return;

    const currentMessage = chatInput;

    const userMessage = {
      sender: "user",
      text: currentMessage
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setChatInput("");

    try {
      const response = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: currentMessage })
      });

      const data = await response.json();

      const botMessage = {
        sender: "bot",
        text: data.reply
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      const botMessage = {
        sender: "bot",
        text: "Unable to connect to the AI chatbot. Please try again."
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="app">
      <header>
        <h1>MERN Blog Application</h1>
        <p>
          Create, manage, and enhance blog content through a modern MERN-stack platform with integrated AI assistance.
        </p>
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

              <div className="post-footer">
                <small>By {post.author}</small>

                <button
                  className="delete-button"
                  onClick={() => deletePost(post._id)}
                >
                  Delete Post
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      <section className="chatbot-section">
        <h2>AI Blog Assistant</h2>
        <p className="chatbot-description">
          Ask Gemini AI for blog ideas, title suggestions, summaries, or MERN
          stack help.
        </p>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.sender === "user" ? "user-message" : "bot-message"}
            >
              <strong>{msg.sender === "user" ? "You" : "AI"}:</strong>{" "}
              {msg.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleChatSubmit} className="chat-form">
          <input
            type="text"
            placeholder="Example: write a blog intro about MERN stack"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <button type="submit">Ask AI</button>
        </form>
      </section>
    </div>
  );
}

export default App;