let { API, Auth } = await import('/libs/api/apiLoader.js')

async function loadInclude($block) {
    const resp = await fetch('/blocks/signup/signup.html');
    const text = await resp.text();
    $block.innerHTML = text;
}

export default async function decorate($block, blockName) {
    loadInclude($block);

        let stuff = await API.get("florango", "/zipcodes", {
            'queryStringParameters': {
                'zip': 90292
            }
        });
        console.log(stuff)

}


async function something(API) {
    let stuff = await API.get("florango", "/zipcodes", {
        'queryStringParameters': {
            'zip': 90292
        }
    });
    return stuff;
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