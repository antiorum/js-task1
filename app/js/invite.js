export default async function inviteHandle() {
  let inviteButton = document.getElementById('invite-button');
  inviteButton.onclick = handleFunction;
}

async function handleFunction() {
  await navigator.clipboard.writeText(location.href).then(() => {
    console.log('url was copied to buffer!');
  }).catch((err) => {
    console.log(err);
  });
}
