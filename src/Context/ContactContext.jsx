import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [message, setMessage] = useState('');
  const [sentMessage, setSentMessage] = useState('');
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [sentMessageFor, setSentMessageFor] = useState('');
  const [contactMessages, setContactMessages] = useState([]);
  const [contactMessagesUser, setContactMessagesUser] = useState([]);

  // Function to create a contact message
  const createContact = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('AdminToken');
      const { data } = await axios.post(
        'https://carcareapp.runasp.net/api/DashBoard/CreateMessage',
        {
          message: message,
          messageFor: sentMessageFor,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setFeedback({ type: 'success', text: 'Message sent successfully!' });
      setContactMessages((prev) => [...prev, data]);
      setSentMessage(message);
      setMessage('');
    } catch (error) {
      setFeedback({ type: 'error', text: 'Failed to send message. Please try again.' });
      console.error('Error creating contact:', error);
    }
  };

  // Function to get contact messages
  const getContactMessages = async () => {
    try {
      const token = localStorage.getItem('AdminToken');
      const { data } = await axios.get('https://carcareapp.runasp.net/api/Contact/GetAllMessages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContactMessages(data);
      return data;
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      throw error;
    }
  };

  // Function to delete a contact message
  const deleteMessage = async (id) => {
    try {
      const token = localStorage.getItem('AdminToken');
      const { data } = await axios.delete(
        `https://carcareapp.runasp.net/api/DashBoard/DeleteMessage/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Message deleted successfully!');
      setContactMessages((prev) => prev.filter((msg) => msg.id !== id));
      return data;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  };

  // Function to get messages for user (not admin)
  const getContactMessagesUser = async () => {
    try {
      const token = localStorage.getItem('UserToken');
      const { data } = await axios.get('https://carcareapp.runasp.net/api/Contact/GetAllMessages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContactMessagesUser(data);
      return data;
    } catch (error) {
      console.error('Error fetching user contact messages:', error);
      alert('Error fetching contact messages. Please try again later.');
      throw error;
    }
  };

  // Function to update a contact message
  const updateContactMessage = async (id, updatedMessage, updatedMessageFor) => {
    try {
      const token = localStorage.getItem('AdminToken');
      const { data } = await axios.put(
        `https://carcareapp.runasp.net/api/DashBoard/UpdateMessage/${id}`,
        {
          message: updatedMessage,
          messageFor: parseInt(updatedMessageFor), // 👈 Make sure it's a number (1, 0, or 3)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setFeedback({ type: 'success', text: 'Message updated successfully!' });
      setContactMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, message: updatedMessage, messageFor: updatedMessageFor } : msg
        )
      );
      return data;
    } catch (error) {
      setFeedback({ type: 'error', text: 'Failed to update message. Please try again.' });
      console.error('Error updating contact message:', error);
    }
  };

  return (
    <ContactContext.Provider
      value={{
        message,
        setMessage,
        sentMessage,
        feedback,
        createContact,
        sentMessageFor,
        setSentMessageFor,
        getContactMessages,
        contactMessages,
        deleteMessage,
        getContactMessagesUser,
        contactMessagesUser,
        updateContactMessage,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = () => useContext(ContactContext);
