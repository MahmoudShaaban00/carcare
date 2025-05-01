import React, { useEffect } from 'react'
import { useContact } from '../../Context/ContactContext'

export default function ContactUser() {
  let { getContactMessagesUser, contactMessagesUser } = useContact()

  useEffect(() => {
    getContactMessagesUser()
  }, [])

  return (
    <div className="px-6 py-10">
      <h3 className="text-2xl font-bold mb-6 text-center text-blue-600">📨 Recent Contact Messages</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {contactMessagesUser.map((msg) => (
          <div
            key={msg.id}
            className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300"
          >
            <p className="text-blue-700 font-semibold text-lg mb-2">📩 {msg.message}</p>
            <p className="text-gray-600 mb-1"><span className="font-medium">🎯 For:</span> {msg.messageFor}</p>
            <p className="text-gray-400 text-sm"><span className="font-medium">🕒 Sent:</span> {new Date(msg.createdOn).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
