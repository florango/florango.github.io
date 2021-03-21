import('/scripts.js')
    .then((mod) => {
        console.log(mod)
    })
    .catch((err) => console.log('oof'));




import { API } from '/scripts.js';

async function loadInclude($block) {
    const resp = await fetch('/blocks/signup/signup.html');
    const text = await resp.text();
    $block.innerHTML = text;
}

export default function decorate($block) {
    loadInclude($block);
    console.log($block)
}


async function something() {
    console.log(API);
    let stuff = await API.get("florango", "/zipcodes", {
        'queryStringParameters': {
            'zip': 90292
        }
    });
}

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
something();