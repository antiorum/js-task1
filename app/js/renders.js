import Service from './service';
import State from './global-state';
import discussionViewHandle from './discussion-view';
import cardChooseHandle from './vote';
import { deleteDiscussionResultHandle } from './discussion-management';

let service = new Service();
let state = new State();
let remindInterval = null;

async function renderRoom(id) {
  await this.renderRoomHeader(id);
  await this.renderUsersInRoom(id);
  await this.renderCards(id);
  await this.renderStories(id);
}

async function renderRoomHeader(roomId) {
  let room = await service.getRoom(roomId);
  let userName = document.getElementById('currentUserName');
  userName.innerText = state.currentUser;

  let roomName = document.getElementById('room-header-name');
  roomName.innerText = room.name;

  let roomIdText = document.getElementById('room-id');
  roomIdText.innerText = room.id;
}

async function renderUsersInRoom(roomId) {
  let room = await service.getRoom(roomId);

  if (state.currentUser !== room.owner.name) {
    let buttons = document.getElementById('users-buttons');
    buttons.classList.add('hidden');
  }
  else {
    let buttons = document.getElementById('users-buttons');
    buttons.classList.remove('hidden');
  }

  let users = document.getElementById('users-list');
  while (users.firstChild) {
    users.removeChild(users.firstChild);
  }
  for (let u of room.users) {
    let user = document.createElement('div');
    user.classList.add('user-in-room');
    user.innerHTML = `<div class="user-name">${u.name}</div><div class="user-avatar"><img src="../images/user.png" alt="user" height="25"></div>`;
    users.appendChild(user);
  }

  let activeStoryId = getActiveDiscussionId(room);
  let buttons = document.getElementById('users-buttons');
  if (activeStoryId !== -1) {
    await renderUsersHeader(activeStoryId, room);
    let discussionResult = await service.getDiscussionResult(activeStoryId);
    let usersVoted = Object.keys(discussionResult.usersMarks);

    for (let userElement of users.childNodes) {
      if (usersVoted.includes(userElement.firstChild.textContent)) {
        let userVotedImg = document.createElement('img');
        userVotedImg.setAttribute('src', 'images/verified.png');
        userVotedImg.setAttribute('height', '20');
        userElement.appendChild(userVotedImg);
      }
    }

    for (let el of buttons.childNodes) {
      if (el.textContent === 'Begin Discussion') el.classList.add('hidden');
      else el.classList.remove('hidden');
    }

    if (room.timerDuration === null) {
      hideTimer();
    }
    else {
      renderTimer(discussionResult, room);
    }
  }
  else {
    let usersHeader = document.getElementById('users-header');
    usersHeader.innerText = 'Discussion not beginning yet';
    for (let el of buttons.childNodes) {
      if (el.textContent !== 'Begin Discussion') el.classList.add('hidden');
      else el.classList.remove('hidden');
    }
    hideTimer();
  }
}

async function renderCards(roomId) {
  await hideResultArea();
  let room = await service.getRoom(roomId);
  let cards = document.getElementById('cards-container');
  while (cards.firstChild) {
    cards.removeChild(cards.firstChild);
  }
  for (let c of room.deck.cards) {
    let card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<p class="card-header">${c.name}<p class="hidden">${c.id}</p></p><div class="card-inner">${c.value == null ? '-' : c.value}</div>`;
    cards.appendChild(card);
    await cardChooseHandle(card);
  }

  let activeStoryId = getActiveDiscussionId(room);
  if (activeStoryId !== -1) {
    await hideResultArea();
    let discussionResult = await service.getDiscussionResult(activeStoryId);
    let cardSelected = discussionResult.usersMarks[state.currentUser];
    if (cardSelected !== undefined) {
      for (let cardElement of cards.childNodes) {
        if (cardElement.firstChild.textContent === cardSelected.name) {
          cardElement.classList.add('card-selected');
        }
      }
    }
  }
  else {
    await hideCards();
  }
}

async function renderRoomCreation() {
  let currentUser = await state.currentUser;
  if (currentUser !== '') {
    let ownerName = document.getElementById('owner-name');
    ownerName.value = currentUser;
    ownerName.setAttribute('disabled', '');
  }

  let decksSelect = document.getElementById('available-decks');
  while (decksSelect.firstChild) {
    decksSelect.removeChild(decksSelect.firstChild);
  }

  let availableDecks = await service.getAllDecks();
  for (let deck of availableDecks) {
    let option = document.createElement('option');
    option.innerHTML = `<p class="hidden">${deck.id}</p> <p>${deck.name}</p>`;
    decksSelect.appendChild(option);
  }
}

async function renderStories(roomId) {
  let room = await service.getRoom(roomId);
  let completedStories = 0;
  let hasActiveStory = false;
  let stories = room.discussionResults;
  let storiesContainer = document.getElementById('stories-container');
  while (storiesContainer.firstChild) {
    storiesContainer.removeChild(storiesContainer.firstChild);
  }
  for (let s of stories) {
    let story = document.createElement('div');
    story.classList.add('stories-item');
    if (!s.isCompleted) {

      story.classList.add('stories-active-story');
      story.innerHTML = `<div class="stories-item-name" id="active-story"><img src="images/list.png" alt="story-list" height="15"><p id="active-story-theme">${s.theme}</p><p class="hidden" id="active-story-id">${s.id}</p></div>`;
      hasActiveStory = true;
    }
    else {
      completedStories++;
      story.innerHTML = `<div class="stories-item-name"><img src="images/list.png" alt="story-list" height="15"><p>${s.theme}</p><p class="hidden">${s.id}</p></div>
            <div class="stories-item-delete"><img src="images/delete.png" alt="story-delete" height="15"></div>`;
      await deleteDiscussionResultHandle(story.childNodes[2].firstChild);
    }
    storiesContainer.appendChild(story);
    await discussionViewHandle(story.childNodes[0]);

  }
  let completedCount = document.getElementById('stories-count');
  completedCount.innerText = `Room Stories (completed: ${completedStories})`;

  if (!hasActiveStory) {
    let storyHeader = document.getElementById('story-header');
    storyHeader.innerText = 'Choose completed story or begin discussion';
  }
  else {
    let storyHeader = document.getElementById('story-header');
    storyHeader.innerText = document.getElementById('active-story-theme').innerText;
  }
}


async function renderDiscussionResult(id) {
  await hideCards();
  let discussionResult = await service.getDiscussionResult(id);
  let resultArea = document.getElementById('discussion-result-container');
  while (resultArea.firstChild) {
    resultArea.removeChild(resultArea.firstChild);
  }
  let discussionElement = document.createElement('div');
  discussionElement.innerHTML = `
    <p>Theme: ${discussionResult.theme}</p>
    <p>Average mark: ${discussionResult.averageMark}</p>
    <p>Resume or comments: ${discussionResult.resume}</p>
  `;
  let marksList = document.createElement('ul');
  marksList.innerText = 'Users votes: ';
  for (let mark in discussionResult.usersMarks) {
    let userMark = document.createElement('li');
    userMark.innerHTML = `<p>User ${mark} choose card ${discussionResult.usersMarks[mark].name} with ${discussionResult.usersMarks[mark].value === null ? 'no value' : 'value ' + discussionResult.usersMarks[mark].value}</p>`;
    marksList.appendChild(userMark);
  }
  discussionElement.appendChild(marksList);
  resultArea.appendChild(discussionElement);
}

function hideTimer() {
  let timer = document.getElementById('timer');
  timer.classList.add('hidden');
}

function renderTimer(discussionResult, room) {
  let timer = document.getElementById('timer');
  timer.classList.remove('hidden');
  let beginning = new Date(discussionResult.beginning);
  let hoursMinutesSeconds = room.timerDuration.split(':').map(string => parseInt(string));

  let ending = beginning;
  ending.setHours(ending.getHours() + hoursMinutesSeconds[0]);
  ending.setMinutes(ending.getMinutes() + hoursMinutesSeconds[1]);
  ending.setSeconds(ending.getSeconds() + hoursMinutesSeconds[2]);

  initializeClock('timer-value', ending);
}

function getTimeRemaining(endTime) {
  let t = Date.parse(endTime) - Date.parse(new Date());
  let seconds = Math.floor((t / 1000) % 60);
  let minutes = Math.floor((t / 1000 / 60) % 60);
  let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  let days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeClock(id, endTime) {
  clearInterval(remindInterval);
  let timer = document.getElementById(id);
  remindInterval = setInterval(() => {
    let timeLeft = getTimeRemaining(endTime);
    timer.innerText = ('0' + timeLeft.hours).slice(-2) + ':' + ('0' + timeLeft.minutes).slice(-2) + ':' + ('0' + timeLeft.seconds).slice(-2);
    if (remindInterval.total <= 0) {
      clearInterval(remindInterval);
    }
  }, 1000);
}

async function hideCards() {
  let placeHolder = document.createElement('p');
  placeHolder.innerText = 'No active discussion...';
  let cardsArea = document.getElementById('cards-container');
  cardsArea.classList.add('hidden');
  let resultArea = document.getElementById('discussion-result-container');
  resultArea.classList.remove('hidden');
  resultArea.appendChild(placeHolder);
}

async function hideResultArea() {
  let cardsArea = document.getElementById('cards-container');
  cardsArea.classList.remove('hidden');
  let resultArea = document.getElementById('discussion-result-container');
  resultArea.classList.add('hidden');
}

async function renderUsersHeader(discussionResultId, room) {
  let discussionResult = await service.getDiscussionResult(discussionResultId);
  let usersInRoom = room.users.map(u => u.name);
  let usersVoted = Object.keys(discussionResult.usersMarks);
  let notVotedUsers = usersInRoom.filter(u => !usersVoted.includes(u));
  let usersHeader = document.getElementById('users-header');
  let usersHeaderText = 'Waiting for ';
  for (let u of notVotedUsers) {
    usersHeaderText += u + ', ';
  }
  usersHeaderText = usersHeaderText.slice(0, -2);
  usersHeaderText += ' to vote';
  usersHeader.innerText = usersHeaderText;
  if (notVotedUsers.length === 0) {
    usersHeader.innerText = 'All users voted!';
  }
}

function getActiveDiscussionId(room) {
  let result = -1;
  for (let story of room.discussionResults) {
    if (!story.isCompleted) result = story.id;
  }
  return result;
}

export { renderRoom, renderRoomHeader, renderUsersInRoom, renderCards, renderRoomCreation, renderStories, renderDiscussionResult };
