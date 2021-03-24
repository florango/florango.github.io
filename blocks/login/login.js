let { API, Auth } = await import('/libs/amplifyLoader.js')

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
    let fields = {
      email: $form.querySelector('#userid').value,
      password: $form.querySelector('#password').value,
    }
    console.log(fields)
    await Auth.signIn(fields.email, fields.password);
    const { attributes } = await Auth.currentAuthenticatedUser();

    const profileData = await API.post("florango", "/profile", {
      body: {
        email: fields.email
      }
    });

    sessionStorage.setItem('userInfo', JSON.stringify(profileData));

    console.log(profileData)
  });
}