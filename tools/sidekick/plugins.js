/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

// This file contains the blog-specific plugins for the sidekick.
(() => {
    const sk = window.hlx && window.hlx.sidekick ? window.hlx.sidekick : window.hlxSidekick;
    if (typeof sk !== 'object') return;
  
    const path = sk.location.pathname;
   
    // PUBLISH ----------------------------------------------------------------------
  
    sk.add({
      id: 'publish',
      button: {
        action: async () => {
          const { config, location } = sk;
          const path = location.pathname;
          sk.showModal(`Publishing ${path}`, true);
          let urls = [path];
          // purge dependencies
          if (Array.isArray(window.hlx.dependencies)) {
            urls = urls.concat(window.hlx.dependencies);
          }

          await Promise.all(urls.map((url) => sk.publish(url)));
          if (config.host) {
            sk.showModal('Please wait …', true);
            // fetch and redirect to production
            const prodURL = `https://${config.host}${path}`;
            await fetch(prodURL, { cache: 'reload', mode: 'no-cors' });
            // eslint-disable-next-line no-console
            console.log(`redirecting to ${prodURL}`);
            await fetch(prodURL, {
              method: 'POST',
              mode: 'no-cors'
            })
            window.location.href = prodURL;            
          } else {
            sk.notify('Successfully published');
          }
        },
      },
    });
  })();