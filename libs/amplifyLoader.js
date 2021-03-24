export let Amplify, Auth, API;

async function loadAmplifyAsModule() {
  Amplify = await import('/libs/aws-amplify.js')
  Amplify = window.aws_amplify.Amplify;
  Amplify.configure({
    Auth: {
      mandatorySignIn: true,
      region: 'us-west-2',
      userPoolId: 'us-west-2_ZbB7wH2mn',
      identityPoolId: 'us-west-2:3b0c9da6-346f-433b-81e1-18aeb6c60959',
      userPoolWebClientId: '5idns144r2o2onippfsu5ouvjb',
      storage: sessionStorage
    },
    API: {
      endpoints: [
        {
          name: 'florango',
          endpoint: 'https://dzeuj2ubch.execute-api.us-west-2.amazonaws.com/dev',
          region: 'us-west-2'
        },
      ]
    }
  });
  console.log('Amplify loaded')
  return Amplify;
}

async function loadAmplifyAsScript() {
  const $script = document.createElement('script');
  $script.type = 'text/javascript';
  $script.src = '/libs/aws-amplify.min.js';
  let $head = document.querySelector('head');
  $head.appendChild($script);
  $script.onload = async function () {
    Amplify = aws_amplify.Amplify;
    API = Amplify.API;
    Auth = Amplify.Auth;
    Amplify.configure({
      Auth: {
        mandatorySignIn: true,
        region: 'us-west-2',
        userPoolId: 'us-west-2_ZbB7wH2mn',
        identityPoolId: 'us-west-2:3b0c9da6-346f-433b-81e1-18aeb6c60959',
        userPoolWebClientId: '5idns144r2o2onippfsu5ouvjb',
        storage: sessionStorage
      },
      API: {
        endpoints: [
          {
            name: 'florango',
            endpoint: 'https://dzeuj2ubch.execute-api.us-west-2.amazonaws.com/dev',
            region: 'us-west-2'
          },
        ]
      }
    });
  }
  console.log('Amplify loaded')
}

async function load() {
  Amplify = await loadAmplifyAsModule();
  API = Amplify.API;
  Auth = Amplify.Auth;
}

await load();