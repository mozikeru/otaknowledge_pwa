const apiUrl = 'https://otaku-basic-nowledge.mozikeru.workers.dev/'; // API URLを設定してください。
const listElement = document.getElementById('list');
const webviewContainer = document.getElementById('webview-container');
const webview = document.getElementById('webview');
const closeWebviewBtn = document.getElementById('close-webview');

// APIからデータを取得
async function fetchData() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  displayList(data);
}

// リスト形式でデータを表示
function displayList(data) {
  data.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = item.title;
    listItem.addEventListener('click', () => {
      openWebview(item.url);
    });
    listElement.appendChild(listItem);
  });
}

// APIからデータを取得
async function reloadData() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  reloadList(data);
}

// リスト形式でデータを更新
function reloadList(data) {
  data.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = item.title;
    listItem.addEventListener('click', () => {
      openWebview(item.url);
    });
    while(listElement.firstChild){
      listElement.removeChild(listElement.firstChild);
    }
    displayList(data);
  });
}

// WebViewでURLを表示
function openWebview(url) {
  webview.src = url;
  webviewContainer.classList.remove('hidden');
}

// WebViewを閉じる
function closeWebview() {
  webview.src = '';
  webviewContainer.classList.add('hidden');
}

// WebViewを閉じるイベントリスナー
closeWebviewBtn.addEventListener('click', closeWebview);

// リロードボタン押下
document.addEventListener('DOMContentLoaded', () => {
  const updateButton = document.getElementById('updateButton');
  updateButton.addEventListener('click', () => {
    reloadData();
  });
});

// アプリを初期化
fetchData();

// Service Workerの登録
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('sw.js')
        .then(registration => {
          console.log('Service Worker 登録成功: ', registration);
        })
        .catch(error => {
          console.log('Service Worker 登録失敗: ', error);
        });
    });
}
