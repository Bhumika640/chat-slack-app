const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth.js');

const PORT = process.env.PORT || 5000;

require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const twilioClient = require('twilio')(accountSid, authToken);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
  res.send('helo!');
});

app.post('/', (req, res) => {
  const { message, user: sender, type, members } = req.body;
  if (type === 'message.new') {
    members
      .filter((member) => member.user.id != sender.id) //not to sned messages to ourselves
      .forEach(({ user }) => {
        if (!user.online) {
          twilioClient.messages
            .create({
              body: `You have a new message from ${message.user.fullName} -${message.text}`,
              messagingServiceSid: messagingServiceSid,
              to: user.phoneNumber
            })
            .then(() => console.log('Message sent!'))
            .catch((err) => console.log(err));
        }
      });
    res.status(200).send('Message Sent!');
  }
  return res.status(200).send('Not a new message request');
});
app.use('/auth', authRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
