import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../api';

const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [message, setMessage] = useState('');
  const [sentMessage, setSentMessage] = useState('');
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [sentMessageFor, setSentMessageFor] = useState('');
  const [contactMessages, setContactMessages] = useState([]);
  const [contactMessagesUser, setContactMessagesUser] = useState([]);
  const [contactMessageTechnical, setContactMessageTechnical] = useState({});

  // Create a new contact message
  const createContact = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('AdminToken');
      const { data } = await axiosInstance.post(
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

  // Fetch all contact messages (admin)
  const getContactMessages = async () => {
    try {
      const token = localStorage.getItem('AdminToken');
      const { data } = await axiosInstance.get('https://carcareapp.runasp.net/api/Contact/GetAllMessages', {
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

  // Delete a contact message by ID
  const deleteMessage = async (id) => {
    try {
      const token = localStorage.getItem('AdminToken');
      const { data } = await axiosInstance.delete(
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

  // Update a contact message by ID
 const updateContactMessage = async (id, updatedMessage, updatedMessageFor) => {
  try {
    const token = localStorage.getItem('AdminToken');
    const { data } = await axiosInstance.put(
      `https://carcareapp.runasp.net/api/DashBoard/UpdateMessage/${id}`,
      {
        message: updatedMessage,
        messageFor: parseInt(updatedMessageFor), // Ensure it's a number
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    setFeedback({ type: 'success', text: 'Message updated successfully!' });

    // Refresh messages from the server
    getContactMessages();

    return data;
  } catch (error) {
    setFeedback({ type: 'error', text: 'Failed to update message. Please try again.' });
    console.error('Error updating contact message:', error);
  }
};


  // Fetch contact messages for normal user
  const getContactMessagesUser = async () => {
    try {
      const token = localStorage.getItem('UserToken');
      const { data } = await axiosInstance.get('https://carcareapp.runasp.net/api/Contact/GetAllMessages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContactMessagesUser(data);
      console.log("user contact", data);
      return data;
    } catch (error) {
      console.error('Error fetching user contact messages:', error);
      alert('Error fetching contact messages. Please try again later.');
      throw error;
    }
  };

  // Fetch contact messages for technical user
  const getContactMessagesTechnical = async () => {
    try {
      const token = localStorage.getItem('TechnicalToken');
      const { data } = await axiosInstance.get('https://carcareapp.runasp.net/api/Contact/GetAllMessages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContactMessageTechnical(data);
      console.log("technical contact", data);
      return data;
    } catch (error) {
      console.error('Error fetching technical contact messages:', error);
      alert('Error fetching contact messages. Please try again later.');
      throw error;
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
        getContactMessagesTechnical,
        contactMessageTechnical,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = () => useContext(ContactContext);
