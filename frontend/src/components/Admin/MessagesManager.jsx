import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { contactService } from '../../services/contactService';

const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await contactService.getMessages();
      setMessages(response.data);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await contactService.markAsRead(id);
      toast.success('Marked as read');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const deleteMessage = async (id) => {
    if (window.confirm('Delete this message?')) {
      try {
        await contactService.deleteMessage(id);
        toast.success('Message deleted');
        fetchMessages();
      } catch (error) {
        toast.error('Failed to delete message');
      }
    }
  };

  if (loading) return <div className="loader">Loading messages...</div>;

  return (
    <div className="form-container">
      <h3>
        <i className="bx bx-envelope"></i> Contact Messages ({messages.length})
      </h3>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <div className="messages-list">
          {messages.map((message) => (
            <div key={message._id} className="message-card" style={{ background: message.isRead ? '#2a2a4a' : '#1e1e3e', borderLeft: message.isRead ? '3px solid #0ef' : '3px solid #ff4757' }}>
              <h4>
                {message.name} - {message.email}
              </h4>
              <div className="message-date">
                <i className="bx bx-calendar"></i> {new Date(message.createdAt).toLocaleString()}
              </div>
              <p>{message.message}</p>
              <div className="message-actions" style={{ marginTop: '10px' }}>
                {!message.isRead && (
                  <button className="btn-edit" onClick={() => markAsRead(message._id)}>
                    Mark as Read
                  </button>
                )}
                <button className="btn-danger" onClick={() => deleteMessage(message._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesManager;