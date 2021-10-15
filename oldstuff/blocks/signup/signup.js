import {
    API,
    Auth,
    session,
    init as initAPILoader,
} from '/libs/api/apiLoader.js';

async function loadInclude($block, blockName) {
    const resp = await fetch(`/blocks/${blockName}/${blockName}.html`);
    const text = await resp.text();
    $block.innerHTML = text;
}

export default async function decorate($block, blockName) {
    loadInclude($block, blockName);
    await initAPILoader();
    if (!session.get('status')) {
        window.location.href = '/account/CheckZipCode';
    }
}

const $main = document.querySelector('main');
$main?.classList.add('appear');



function stuff() {
    try {
        const user = aws_amplify.Amplify.Auth.signIn("<username>", "<pass>");
        console.log(user);
    } catch (error) {
        console.log('error signing in', error);
    }

    try {
        const { user } = aws_amplify.Amplify.Auth.signUp({
            username: "<username>",
            password: "<pass>",
            attributes: {
                email: "<email>" // optional

            }
        });
        console.log(user);
    } catch (error) {
        console.log('error signing up:', error);
    }
}