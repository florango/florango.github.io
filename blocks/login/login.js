const { API, Auth } = await import('/libs/api/apiLoader.js');
const overlay = await import('/libs/overlay/overlay.js');

async function loadInclude($block, blockName) {
  const resp = await fetch(`/blocks/${blockName}/${blockName}.html`);
  const text = await resp.text();
  $block.innerHTML = text;
}

export default async function decorate($block, blockName) {
  await loadInclude($block, blockName);
  let $form = $block.querySelector('form');
  $form.addEventListener('submit', async (e) => {
    e.preventDefault();
    overlay.show();
    try {
      let fields = {
        email: $form.querySelector('#userid').value,
        password: $form.querySelector('#password').value,
      }

      await Auth.signIn(fields.email, fields.password);
      const { attributes } = await Auth.currentAuthenticatedUser();

      const profileData = await API.post("florango", "/profile", {
        body: {
          email: fields.email
        }
      });

      sessionStorage.setItem('userInfo', JSON.stringify(profileData));
      window.location.href = '/account/Shopper.html';
    } catch (ew) {
      let message = error.toString();

      // Auth errors
      if (!(error instanceof Error) && error.message) {
        message = error.message;
      }
      overlay.hide();
    }
  });
}