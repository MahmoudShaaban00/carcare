import React from 'react';
import { useContact } from '../../../Context/ContactContext'
export default function CreateContact() {

  const { message, setMessage, sentMessage, feedback, createContact, sentMessageFor, setSentMessageFor } = useContact();

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Send Discount Message</h2>

      {/* from contact*/}
      <form onSubmit={createContact}>

        <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
          Message
        </label>

        <input type="text" id="message" placeholder="e.g., Get 20% off all services this weekend!" name="message" value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border border-gray-300 rounded-md p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <select className="mb-4 w-full border rounded p-2" onChange={(e) => setSentMessageFor(e.target.value)} value={sentMessageFor}>

          <option value="Users">Users</option>
          <option value="Technicals">Technicals</option>
          <option value="All">All</option>
        </select>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
          Send
        </button>
      </form>

      {feedback.text && (
        <div
          className={`mt-4 text-center font-semibold ${feedback.type === 'success' ? 'text-green-600' : 'text-red-500'
            }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Display the sent message after sending it */}
      {sentMessage && (
        <div className="mt-6 p-4 bg-blue-100 text-blue-800 rounded-lg shadow-inner relative">
          <div className="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-blue-100" />
          <p className="text-center font-medium">📣 You just sent:</p>
          <p className="italic text-center mt-1">“{sentMessage}”</p>
        </div>
      )}
    </div>
  );
}
