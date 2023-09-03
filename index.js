let privateKey = null;
let publicKey = null;

function btnClick(e) {
  const thisURl = window.location.href;
  console.log("this URL: ", thisURl);
  window.location.href = `https://kameroon.web.app?redirect_url=${thisURl}&public_key=${encodeURIComponent(publicKey)}`
}

async function render() {
  const searchParams = new URLSearchParams(window.location.search);
  const el = document.getElementById("header");
  if (searchParams.has('code')) {
    const code = searchParams.get('code');
    const plainTextCode = await decryptMessage(privateKey, decodeBase64EncryptedMessage(decodeURIComponent(code)));
    const windowUrl = window.location.href;
    const {origin, pathname} = new URL(windowUrl);
    const urlWithoutQueryOrHash = `${origin}${pathname}`;
    el.innerHTML = `<p style="white-space: pre-wrap; word-break: break-word; padding: 20px">${plainTextCode}</p><a class="App-link" href="${urlWithoutQueryOrHash}">Back</a>`;
  }
  else {
    el.innerHTML = `<p>This is a demo showing QR code scanning functionality using <a class="App-link" href="#" onclick="btnClick()">Kameroon</a>!</p>`;
  }
}

(async () => {
  try {
    const keys = await fetchKeysFromLocalStorage();
    privateKey = keys.privateKey;
    publicKey = keys.publicKey;
  } catch (e) {
    console.warn(`keys are not in cache (${e}), creating new...`);
    const keyPair = await createKeys();
    privateKey = keyPair.privateKey;
    publicKey = keyPair.publicKey;
    await saveKeysToLocalStorage({privateKey, publicKey});

    const keys = await fetchKeysFromLocalStorage();
    privateKey = keys.privateKey;
    publicKey = keys.publicKey;
  }
  await render();
})();




