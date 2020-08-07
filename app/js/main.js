import Service from './service';
import State from './global-state';
import inviteHandle from './invite';
import * as renders from './renders';
import { beginDiscussionHandle, endDiscussionHandle, resetDiscussionHandle } from './discussion-management';
import { showRoom, showCreationRoom, showSignIn } from './navigation';
import createConnection from './signal-r';
import signInHandle from './sign';
import { createRoomHandle } from './create-room';

let service = new Service();
let state = new State();

let location = window.location;

async function showComponents() {
  await renders.renderRoomCreation();
  if (location.hash === '') showCreationRoom();
  else if (location.hash === '#room') {
    state.currentUser = await service.getCurrentUsername();
    if (state.currentUser === '') {
      showSignIn();
    }
    else {
      let roomId = document.location.search.substring(1);
      if (state.connection === null) state.connection = createConnection();
      await service.enterRoom(roomId, '');
      await renders.renderRoom(roomId);
      showRoom();
    }
  }
  else showCreationRoom();
}

window.onpopstate = async function() {
  await showComponents();
};

window.onload = async function() {
  state.currentUser = service.getCurrentUsername();
  await showComponents();
  await signInHandle();
  await inviteHandle();
  await beginDiscussionHandle();
  await endDiscussionHandle();
  await resetDiscussionHandle();
  await createRoomHandle();
};
