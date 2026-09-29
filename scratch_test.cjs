const { spawn } = require('child_process');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--no-sandbox',
  '--disable-gpu',
  'http://localhost:3001'
]);

setTimeout(async () => {
  try {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', async () => {
        const pages = JSON.parse(data);
        console.log('Pages:', pages.map(p => ({ title: p.title, url: p.url })));
        
        let page = pages.find(p => p.url.includes('localhost:3001') || p.type === 'page');
        if (!page) {
          console.log('No page found, creating new target');
          chrome.kill();
          return;
        }

        const ws = new WebSocket(page.webSocketDebuggerUrl);
        let id = 1;
        const send = (method, params = {}) => new Promise((resolve) => {
          const msgId = id++;
          const handler = (event) => {
            const res = JSON.parse(event.data);
            if (res.id === msgId) {
              ws.removeEventListener('message', handler);
              resolve(res);
            }
          };
          ws.addEventListener('message', handler);
          ws.send(JSON.stringify({ id: msgId, method, params }));
        });

        ws.onopen = async () => {
          ws.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            if (data.method === 'Runtime.consoleAPICalled') {
              console.log('CONSOLE:', data.params.type, data.params.args.map(a => a.value || a.description).join(' '));
            }
            if (data.method === 'Runtime.exceptionThrown') {
              console.error('EXCEPTION:', data.params.exceptionDetails);
            }
          });

          await send('Runtime.enable');
          await send('Page.enable');
          await send('DOM.enable');

          await send('Page.navigate', { url: 'http://localhost:3001' });
          await new Promise(r => setTimeout(r, 3000));

          // Evaluate document and click the button
          const evalRes = await send('Runtime.evaluate', {
            expression: `
              (() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const reqBtn = buttons.find(b => b.textContent.includes('Request Blood from'));
                if (!reqBtn) return 'Button not found! Found buttons: ' + buttons.map(b => b.textContent.trim()).join(' | ');
                reqBtn.click();
                const modal = document.querySelector('.modal-overlay');
                return {
                  clickedText: reqBtn.textContent.trim(),
                  modalFound: !!modal,
                  modalDisplay: modal ? window.getComputedStyle(modal).display : null,
                  modalHtml: modal ? modal.outerHTML.slice(0, 300) : null
                };
              })()
            `,
            returnByValue: true
          });

          console.log('EVAL RESULT:', JSON.stringify(evalRes, null, 2));

          await new Promise(r => setTimeout(r, 1000));
          chrome.kill();
          process.exit(0);
        };
      });
    }).on('error', (err) => {
      console.error('HTTP err:', err);
      chrome.kill();
      process.exit(1);
    });
  } catch (e) {
    console.error(e);
    chrome.kill();
    process.exit(1);
  }
}, 2500);
