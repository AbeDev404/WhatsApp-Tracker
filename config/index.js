const firebaseConfig = {
    apiKey: "AIzaSyDABtkYPe28pGLeBFOACaWGibnj3-3vLFY",
    authDomain: "whatstracker-2c129.firebaseapp.com",
    databaseURL: "https://whatstracker-2c129-default-rtdb.firebaseio.com",
    projectId: "whatstracker-2c129",
    storageBucket: "whatstracker-2c129.appspot.com",
    messagingSenderId: "1059092555524",
    appId: "1:1059092555524:web:4bca956835e65028d65251",
    measurementId: "G-M5LJFT37M7"
};

export default {
  firebaseConfig: firebaseConfig,
  firebaseApp: null,

  getContactsInjectCode: `
  var data = []
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
  const start = async () => {
    await sleep(5000)
    const is_link = document.getElementsByTagName('body')[0].innerHTML.indexOf('Link a device') >= 0;
    if(is_link) {
        window.ReactNativeWebView.postMessage('Link a device');
    } else {
        document.evaluate('/html/body/div/div/div/div[4]/header/div[2]/div/span/div[3]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
        await sleep(1000)
        const length = document.evaluate('/html/body/div/div/div/div[3]/div/span/div/span/div/div[2]/div[5]/div/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.children.length;

        for(var i = 0 ; i < length ; i++) {
            window.chat_index = i;
            document.evaluate('/html/body/div/div/div/div[4]/header/div[2]/div/span/div[3]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
            await sleep(2000)
            const length = document.evaluate('/html/body/div/div/div/div[3]/div/span/div/span/div/div[2]/div[5]/div/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.children.length;
            
            let item = document.evaluate('/html/body/div/div/div/div[3]/div/span/div/span/div/div[2]/div[5]/div/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.children[window.chat_index].children[0];
            if(item.children[0].children.length >= 2) {
                const src = document.evaluate('/html/body/div/div/div/div[3]/div/span/div/span/div/div[2]/div[5]/div/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.children[window.chat_index].children[0].children[0].children[0].children[0].children[0].children[0].getAttribute('src')
                const phoneNumber = document.evaluate('/html/body/div/div/div/div[3]/div/span/div/span/div/div[2]/div[5]/div/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.children[window.chat_index].children[0].children[0].children[1].children[0].children[0].children[0].innerHTML.match(/\\d/g)
                
                document.evaluate('/html/body/div/div/div/div[3]/div/span/div/span/div/div[2]/div[5]/div/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.children[window.chat_index].children[0].children[0].click();
                await sleep(100)
                
                if(phoneNumber !== null) {
                    data.push({avatar: src, name: '', phone: phoneNumber.join('')})
                } else {        
                    document.evaluate('/html/body/div/div/div/div[5]/div/header/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click()
                    await sleep(100)
            
                    const name_obj = document.evaluate('/html/body/div/div/div/div[6]/span/div/span/div/div/section/div/div[2]/h2/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    const name = name_obj === null ? '' : name_obj.innerHTML;

                    const phone_obj = document.evaluate('/html/body/div/div/div/div[6]/span/div/span/div/div/section/div/div[2]/div/span/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    const phone = phone_obj === null ? '' : phone_obj.innerHTML;
                    if(phone !== '') data.push({avatar: src, name: name, phone: phone.match(/\\d/g).join('')})
                }
            } else {
                document.evaluate('/html/body/div/div/div/div[3]/div/span/div/span/div/header/div/div/div/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click()
            }    
        }
        
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
    }
  }
  start();
  `,

  getStatusInjectCode: `
    window._chat_index = 0;
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

    setInterval(async function() {
        document.evaluate('/html/body/div/div/div/div[4]/header/div[2]/div/span/div[3]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
        await sleep(1000)
        const length = document.evaluate('/html/body/div/div/div/div[3]/div/span/div/span/div/div[2]/div[5]/div/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.children.length;
        document.evaluate('/html/body/div/div/div/div[3]/div/span/div/span/div/div[2]/div[5]/div/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.children[window._chat_index].children[0].children[0].click();
        window._chat_index++;
        await sleep(3000);
        if(window._chat_index >= length) window._chat_index = 0;
        
        const _status_span = document.evaluate('/html/body/div/div/div/div[5]/div/header/div[2]/div[2]/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if(_status_span !== null) {
            const name = document.evaluate('/html/body/div/div/div/div[5]/div/header/div[2]/div[1]/div/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML
            const status = document.evaluate('/html/body/div/div/div/div[5]/div/header/div[2]/div[2]/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML
            
            window.ReactNativeWebView.postMessage(JSON.stringify({name: name, status: status}));
        }
    }, 5000)
  `
}