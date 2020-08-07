import Service from './service';
import State from './global-state';
import createConnection from './signal-r';

let service = new Service();
let state = new State();
const navigation = require('./navigation');

export default async function signInHandle() {
  let signForm = document.getElementById('sign-form');
  signForm.addEventListener('submit', (event) => {
    handleSign(event);
  });
}


async function handleSign(event) {
  event.preventDefault();
  await service.auth(event.target[0].value);
  state.connection = await createConnection();
  state.currentUser = await service.getCurrentUsername();
  let roomId = document.location.search.substring(1);
  await service.enterRoom(roomId, '');
  navigation.showRoom();
}
