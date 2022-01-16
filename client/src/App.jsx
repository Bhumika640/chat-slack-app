import React, { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';

import { ChannelListContainer, ChannelContainer, Auth } from './components';

import 'stream-chat-react/dist/css/index.css';
import './App.css';

const cookies = new Cookies();
const apiKey = 'wkkak2m7zxft';
const authToken = cookies.get('token');
const client = StreamChat.getInstance(apiKey);

//if authToken is true-> we want to create the user
//if we have the user-> connect
if (authToken) {
  client.connectUser(
    {
      id: cookies.get('userId'),
      name: cookies.get('username'),
      fullName: cookies.get('fullName'),
      phoneNumber: cookies.get('phoneNumber'),
      image: cookies.get('avatarURL'),
      hashedPassword: cookies.get('hashedPassword')
    },
    authToken
  );
}
const App = () => {
  const [createType, setCreateType] = useState(''); //for new chat
  const [isCreating, setIsCreating] = useState(false); //if user is creating new chatroom
  const [isEditing, setIsEditing] = useState(false); //if user is editing the chat room

  if (!authToken) return <Auth />;
  return (
    <div className='app__wrapper'>
      <Chat client={client} theme='team light'>
        <ChannelListContainer
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
        />
        <ChannelContainer
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          createType={createType}
        />
      </Chat>
    </div>
  );
};

export default App;
