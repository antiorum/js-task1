import Service from './service';
import State from './global-state';

let service = new Service();
let state = new State();

export async function createRoomHandle() {
  let form = document.getElementById('room-creation-form');
  await form.addEventListener('submit', (event) => {
    handleFunction(event);
  });
}

async function handleFunction(event) {
  event.preventDefault();
  let password = '';
  let name = event.target[1].value;
  let deckId = event.target[2].value.split(' ')[0];
  if (state.currentUser == null) {
    await service.auth(event.target[0]);
  }
  let roomId = await service.createRoom(password, name, '', deckId);
  window.location = `/?${roomId}#room`;
}
