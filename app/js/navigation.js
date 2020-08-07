export function showSignIn() {
  document.getElementById('room').classList.add('hidden');
  document.getElementById('creation-room').classList.add('hidden');
  document.getElementById('sign-in').classList.remove('hidden');
}

export function showRoom() {
  document.getElementById('room').classList.remove('hidden');
  document.getElementById('creation-room').classList.add('hidden');
  document.getElementById('sign-in').classList.add('hidden');
}

export function showCreationRoom() {
  document.getElementById('room').classList.add('hidden');
  document.getElementById('creation-room').classList.remove('hidden');
  document.getElementById('sign-in').classList.add('hidden');
}

