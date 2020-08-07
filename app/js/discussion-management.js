import Service from './service';

let service = new Service();

export async function beginDiscussionHandle() {
  let beginButton = document.getElementById('users-buttons').childNodes[2];
  beginButton.addEventListener('click', (event) => {
    event.preventDefault();
    let theme = prompt('Input theme');
    handleDiscussion(theme);
  });
}

async function handleDiscussion(theme) {
  let roomId = document.location.search.substring(1);
  await service.startDiscussion(roomId, theme);
}

export async function endDiscussionHandle() {
  let endButton = document.getElementById('users-buttons').childNodes[1];
  endButton.addEventListener('click', (event) => {
    event.preventDefault();
    let resume = prompt('Input resume or comments');
    handleEnd(resume);
  });
}

async function handleEnd(resume) {
  let roomId = document.location.search.substring(1);
  let discussionId = document.getElementById('active-story-id').textContent;
  await service.endDiscussion(roomId, resume, discussionId);
}

export async function resetDiscussionHandle() {
  let resetButton = document.getElementById('users-buttons').childNodes[0];
  resetButton.addEventListener('click', (event)=>{
    event.preventDefault();
    handleReset();
  });
}

async function handleReset() {
  let roomId = document.location.search.substring(1);
  let discussionId = document.getElementById('active-story-id').textContent;
  await service.resetDiscussion(roomId, discussionId);
}

export async function deleteDiscussionResultHandle(element) {
  element.addEventListener('click', (event) => {
    handleDelete(event);
  });
}

async function handleDelete(event) {
  event.preventDefault();
  let roomId = document.location.search.substring(1);
  let discussionId = event.target.parentElement.parentElement.childNodes[0].childNodes[2].textContent;
  await service.deleteDiscussionResult(roomId, discussionId);
}
