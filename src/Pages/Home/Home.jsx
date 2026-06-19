import React from "react";
import "./Home.css";
import { logout } from "../../config/config";

const chats = [
  {
    name: "Aarav",
    message: "Send the public key...",
    time: "2m ago",
    unread: 3,
  },
  {
    name: "Mia",
    message: "Session encrypted.",
    time: "10m ago",
    unread: 1,
  },
  {
    name: "Rohan",
    message: "Meeting at 8?",
    time: "1h ago",
    unread: 0,
  },
];

const Home = () => {
  return (
    <div className="home">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">अक्षरसंवाद</div>

        <div className="nav">
          <div className="nav-item active">Chats</div>
          <div className="nav-item">Requests</div>
          <div className="nav-item">Settings</div>
        </div>

        <button onClick={logout()} className="logout">Logout</button>
      </div>

      {/* Main */}
      <div className="main">
        {/* Topbar */}
        <div className="topbar">
          <div>
            <h2>Welcome, Yashass</h2>
            <p>AS48327 • End-to-End Encrypted</p>
          </div>

          <div className="top-actions">
            <input type="text" placeholder="Search..." />
            <button>+</button>
          </div>
        </div>

        {/* Chat Section */}
        <div className="chat-section">
          <div className="chat-list">
            <h3>Recent Chats</h3>

            {chats.map((chat, index) => (
              <div key={index} className="chat-card">
                <div className="avatar">{chat.name[0]}</div>

                <div className="chat-info">
                  <h4>{chat.name}</h4>
                  <p>{chat.message}</p>
                </div>

                <div className="chat-meta">
                  <span>{chat.time}</span>
                  {chat.unread > 0 && (
                    <div className="unread">{chat.unread}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Security Panel */}
          <div className="security-panel">
            <h3>Security Status</h3>

            <div className="security-box">
              <p>Encryption: Active</p>
              <p>Fingerprint: 9f1a7d...</p>
              <p>Verified: 2h ago</p>

              <button>Lock Session</button>
            </div>

            <div className="active-users">
              <h3>Active Now</h3>

              <div className="user">Aarav</div>
              <div className="user">Mia</div>
              <div className="user">Rohan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;