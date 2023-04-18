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

if (isIOS()) {
  registerIOSInstallInstructions(document.getElementById("InstallBtn"));
} else {
  registerInstallAppEvent(document.getElementById("InstallBtn"));
}

function registerIOSInstallInstructions(elem) {
  elem.style.display = "inline-block";
  elem.addEventListener("click", showIOSInstallInstructions);
}

//バナー表示をキャンセルし、代わりに表示するDOM要素を登録する関数
//引数１：イベントを登録するHTMLElement
function registerInstallAppEvent(elem){
  //インストールバナー表示条件満足時のイベントを乗っ取る
  window.addEventListener('beforeinstallprompt', function(event){
    console.log("beforeinstallprompt: ", event);
    event.preventDefault(); //バナー表示をキャンセル
    elem.promptEvent = event; //eventを保持しておく
    elem.style.display = "inline-block"; //要素を表示する
    return false;
  });
  //インストールダイアログの表示処理
  function installApp() {
    if(elem.promptEvent){
      elem.promptEvent.prompt(); //ダイアログ表示
      elem.promptEvent.userChoice.then(function(choice){
        elem.style.display = "none";
        elem.promptEvent = null; //一度しか使えないため後始末
      });//end then
    }
  }//end installApp
  //ダイアログ表示を行うイベントを追加
  elem.addEventListener("click", installApp);
}//end registerInstallAppEvent

// iOS判定
function isIOS() {
  return (
    ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) ||
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
}

function showIOSInstallInstructions() {
  function showIOSInstallInstructions() {
    var instructions = document.getElementById("ios-install-instructions");
    instructions.style.display = "block";
  
    var closeButton = document.getElementById("close-instructions");
    closeButton.addEventListener("click", function () {
      instructions.style.display = "none";
    });
  }
}

