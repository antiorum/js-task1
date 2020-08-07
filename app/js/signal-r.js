import * as signalR from '@aspnet/signalr';
import * as renders from './renders';

let roomId = document.location.search.substring(1);

export default async function createConnection() {
  const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:44346/roomsHub')
    .build();
  await hubConnection.start();
  hubConnection.on('UpdateUsersInRoom', async() => {
    await renders.renderUsersInRoom(roomId);
  });
  hubConnection.on('StartDiscussion', async() => {
    await renders.renderRoom(roomId);
  });
  hubConnection.on('EndDiscussion', async() => {
    let discussionId = document.getElementById('active-story-id').textContent;
    await renders.renderStories(roomId);
    await renders.renderDiscussionResult(discussionId);
    await renders.renderUsersInRoom(roomId);
  });
  hubConnection.on('UserVoted', async() => {
    await renders.renderCards(roomId);
    await renders.renderUsersInRoom(roomId);
  });
  hubConnection.on('UpdateDiscussionResults', async() => {
    await renders.renderStories(roomId);
  });

  return hubConnection;
}



