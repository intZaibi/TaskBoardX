import React, { useState } from 'react';
import NotificationSocket from './Notifications';

function App() {
  const [message, setMessage] = useState('');
  const [targetId, setTargetId] = useState(2); // Send to user 2
  const sender = { id: 1 }; // Assume logged-in user is ID 1

  const sendNotification = async () => {
    const res = await fetch('http://localhost:4000/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user': JSON.stringify(sender),
      },
      body: JSON.stringify({
        userId: targetId,
        message,
      }),
    });

    const data = await res.json();
    console.log('Notification sent:', data);
  };

  return (
    <div className="flex flex-col items-center p-6 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4">📣 Notification Test (User 1)</h1>

      <NotificationSocket userId={sender.id} />

      <input
        className="border p-5 w-full mb-2"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        type="number"
        value={targetId}
        onChange={(e) => setTargetId(Number(e.target.value))}
        placeholder="Target User ID"
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={sendNotification}
      >
        Send Notification
      </button>
    </div>
  );
}

export default App;
