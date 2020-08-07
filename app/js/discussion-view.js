import * as renders from './renders';

export default async function discussionViewHandle(element) {
  element.addEventListener('click', (event) => {
    handleFunction(event);
  });
}

async function handleFunction(event) {
  event.preventDefault();
  if (event.path[1].id !== 'active-story') {
    let id = event.path[1].childNodes[2].textContent;
    await renders.renderDiscussionResult(id);
  }
  else {
    await renders.renderCards(document.location.search.substring(1));
  }
}
