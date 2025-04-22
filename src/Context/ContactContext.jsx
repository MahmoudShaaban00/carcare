import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [message, setMessage] = useState('');
  const [sentMessage, setSentMessage] = useState('');
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [sentMessageFor, setSentMessageFor] = useState('');

  const createContact = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('AdminToken');
      console.log('message', message);
  
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
      setSentMessage(message);
      setMessage('');
    } catch (error) {
      setFeedback({
        type: 'error',
        text: 'Failed to send message. Please try again.',
      });
      console.error('Error creating contact:', error);
    }
  };
  
  return (
    <ContactContext.Provider
      value={{ message, setMessage, sentMessage, feedback, createContact, sentMessageFor, setSentMessageFor }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = () => useContext(ContactContext);
