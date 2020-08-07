import Service from './service';

let service = new Service();

export default async function cardChooseHandle(card) {
  card.addEventListener('click', (event) => {
    handleCard(event);
  });
}

async function handleCard(event) {
  event.preventDefault();
  let discussionResultId = document.getElementById('active-story-id').textContent;
  let roomId = document.location.search.substring(1);
  let cardId = event.path[0].childNodes[1].textContent;
  await service.vote(roomId, cardId, discussionResultId);
}
