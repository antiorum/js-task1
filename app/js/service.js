export default class Service {
    _apiBase = 'https://localhost:44346/api/';

    auth = async(username) => {
      let data = new FormData();
      data.set('name', username);
      let response = await fetch(this._apiBase + 'users/auth', {
        method: 'POST',
        body: data,
        credentials: 'include'
      });
    };

    logout = async() => {
      await fetch(this._apiBase + 'users/logout');
    };

    getCurrentUsername = async() => {
      let result = await fetch(this._apiBase + 'users/currentUser', {
        credentials: 'include',
      });
      return result.text();
    };

    getAllCards = async() => {
      let result = await fetch(this._apiBase + 'cards', {
        credentials: 'include'
      });
      return result.json();
    };

    getAllDecks = async() => {
      let result = await fetch(this._apiBase + 'decks', {
        credentials: 'include'
      });
      return result.json();
    };

    getAllRooms = async() => {
      let result = await fetch(this._apiBase + 'rooms', {
        credentials: 'include'
      });
      let r = await result.json();
      return await r.map(this.transformRoom);
    };

    transformRoom = (item) => {
      return {
        id: item.id,
        owner: item.owner.name,
        deck: item.deck.name,
        hasPassword: item.protected,
      };
    };

    deleteCard = async(id) => {
      await fetch(this._apiBase + 'cards/' + id, {
        method: 'delete',
        credentials: 'include'
      });
    };

    deleteDeck = async(id) => {
      await fetch(this._apiBase + 'decks/' + id, {
        method: 'delete',
        credentials: 'include'
      });
    };

    deleteRoom = async(id) => {
      await fetch(this._apiBase + 'rooms/' + id, {
        method: 'delete',
        credentials: 'include'
      });
    };

    createRoom = async(password, name, timerMinutes, deckId) => {
      let data = new FormData();
      data.append('password', password);
      data.append('name', name);
      data.append('timer', timerMinutes);
      data.append('deck', deckId);

      let id = await fetch(this._apiBase + 'rooms', {
        method: 'post',
        body: data,
        credentials: 'include'
      });

      return id.text();
    };

    enterRoom = async(roomId, password) => {
      let data = new FormData();
      data.append('password', password);
      await fetch(this._apiBase + 'rooms/' + roomId, {
        method: 'post',
        body: data,
        credentials: 'include'
      });
    };

    exitRoom = async(roomId) => {
      await fetch(`${this._apiBase}rooms/${roomId}/exit`, {
        method: 'post',
        credentials: 'include'
      });
    };

    getRoom = async(roomId) => {
      let result = await fetch(this._apiBase + 'rooms/' + roomId, {
        credentials: 'include'
      });
      return result.json();
    };

    getDiscussionResult = async(discussionResultId) => {
      let result = await fetch(this._apiBase + 'discussionResults/' + discussionResultId, {
        credentials: 'include'
      });
      return result.json();
    };

    startDiscussion = async(roomId, theme) => {
      let data = new FormData();
      data.append('theme', theme);
      await fetch(this._apiBase + 'rooms/' + roomId + '/startDiscussion', {
        method: 'put',
        body: data,
        credentials: 'include'
      });
    };

    vote = async(roomId, cardId, discussionResultId) => {
      let data = new FormData();
      data.append('cardId', cardId);
      data.append('discussionId', discussionResultId);
      await fetch(this._apiBase + 'rooms/' + roomId + '/addMark', {
        method: 'put',
        body: data,
        credentials: 'include'
      });
    };

    endDiscussion = async(roomId, resume, discussionResultId) => {
      let data = new FormData();
      data.append('resume', resume);
      data.append('discussionId', discussionResultId);
      await fetch(this._apiBase + 'rooms/' + roomId + '/endDiscussion', {
        method: 'put',
        body: data,
        credentials: 'include'
      });
    };

    resetDiscussion = async(roomId, discussionResultId) => {
      let data = new FormData();
      data.append('discussionId', discussionResultId);
      await fetch(this._apiBase + 'rooms/' + roomId + '/restartDiscussion', {
        method: 'put',
        body: data,
        credentials: 'include'
      });
    };

    deleteDiscussionResult = async(roomId, discussionResultId) => {
      await fetch(this._apiBase + 'rooms/' + roomId + '/deleteDiscussion/' + discussionResultId, {
        method: 'delete',
        credentials: 'include'
      });
    }
}
