// src/Components/DashBoard/Contact/CreateContact.jsx
import React, { useEffect, useState } from 'react';
import { useContact } from '../../../Context/ContactContext';

export default function CreateContact() {
  const {
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
    updateContactMessage,
  } = useContact();

  const [editingMessage, setEditingMessage] = useState(null);
  const [updatedMessage, setUpdatedMessage] = useState('');
  const [updatedMessageFor, setUpdatedMessageFor] = useState('');

  const handleDelete = (id) => {
    deleteMessage(id);
  };

  const handleUpdate = async (id) => {
    if (updatedMessage.trim()) {
      await updateContactMessage(id, updatedMessage, updatedMessageFor);
      setEditingMessage(null);
      setUpdatedMessage('');
      setUpdatedMessageFor('');
    } else {
      alert('Please enter a valid message');
    }
  };

  useEffect(() => {
    getContactMessages();
  }, []);

  return (
    <div className="w-full mx-auto mt-10 p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Send Contact Message</h2>

      {/* Contact form */}
      <form onSubmit={createContact}>
        <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
          Message
        </label>
        <input
          type="text"
          id="message"
          placeholder="e.g., Get 20% off all services this weekend!"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border border-gray-300 rounded-md p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          className="mb-4 w-full border rounded p-2"
          onChange={(e) => setSentMessageFor(e.target.value)}
          value={sentMessageFor}
        >
          <option value="1">Users</option>
          <option value="0">Technicals</option>
          <option value="3">All</option>
        </select>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
          Send
        </button>
      </form>

      {feedback.text && (
        <div className={`mt-4 text-center font-semibold ${feedback.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
          {feedback.text}
        </div>
      )}

      {/* Sent message */}
      {sentMessage && (
        <div className="mt-6 p-4 bg-blue-100 text-blue-800 rounded-lg shadow-inner relative">
          <div className="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-blue-100" />
          <p className="text-center font-medium">📣 You just sent:</p>
          <p className="italic text-center mt-1">“{sentMessage}”</p>
        </div>
      )}

      {/* Display contact messages */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4 text-center">📌 Recent Messages</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactMessages.map((msg) => (
            <div key={msg.id} className="p-4 border rounded shadow-sm bg-gray-50">
              <p className="font-medium text-lg">📩 {msg.message}</p>
              <p className="text-lg text-gray-500">For: {msg.messageFor}</p>
              <p className="text-sm text-gray-400">Sent on: {new Date(msg.createdOn).toLocaleString()}</p>

              <button onClick={() => handleDelete(msg.id)} className="bg-red-600 text-lg rounded-lg mt-2 py-1 px-2 text-white">
                Delete
              </button>

              <button
                onClick={() => {
                  setEditingMessage(msg.id);
                  setUpdatedMessage(msg.message);
                  setUpdatedMessageFor(msg.messageFor);
                }}
                className="bg-yellow-600 text-lg rounded-lg mt-2 py-1 px-2 text-white ml-2"
              >
                Edit
              </button>

              {editingMessage === msg.id && (
                <div className="mt-4">
                  <textarea
                    value={updatedMessage}
                    onChange={(e) => setUpdatedMessage(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows="3"
                  />
                  <select
                    value={updatedMessageFor}
                    onChange={(e) => setUpdatedMessageFor(e.target.value)}
                    className="w-full mt-2 p-2 border rounded-md"
                  >
                    <option value="1">Users</option>
                    <option value="0">Technicals</option>
                    <option value="3">All</option>
                  </select>
                  <button
                    onClick={() => handleUpdate(msg.id)}
                    className="bg-green-600 text-white py-1 px-4 rounded mt-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setEditingMessage(null);
                      setUpdatedMessage('');
                      setUpdatedMessageFor('');
                    }}
                    className="bg-gray-600 text-white py-1 px-4 rounded mt-2 ml-2"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
