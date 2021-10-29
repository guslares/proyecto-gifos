const APIKEY = 'gQI6Rlg7k278ElyIYGIW7pRogbFniBkT'
var activeTheme
let guifo
let recorder
let camStream = null;
let form = new FormData()
let videoBlob
let intervalo
let h = 0;
let m = 0;
let s = 0;
let cs = 0;



const boxTittle = document.getElementById('box-tittle')
const uploadContaint = document.getElementById('upload-container')
const buttonCapture = document.getElementById('button-capture')

const buttonCaptureText = document.getElementById('capture-text')
const buttonCaptureIcon = document.getElementById('capture-icon')
const mediaContainer = document.getElementById('media-container')

document.addEventListener('DOMContentLoaded', e => {
  renderMyGifsGallery()

  document.getElementById('start-button').addEventListener('click', showCameraPreview)
  activeTheme = localStorage.getItem('themeActive')

  checkActiveTheme(activeTheme)

  console.log(localStorage.getItem('themeActive'))
});

function checkActiveTheme(theme) {

  if (theme == null) {
    localStorage.setItem('themeActive', 'day-theme')
    activeTheme = 'day-theme'
  }
  else if (theme == "night-theme") {

    changeThemeNight()
  }

}

function changeThemeNight() {
  document.getElementById('sheetStyle').href = "assests/styles/themeNight.css"
  document.getElementById('arrow').src = "assests/img/arrow_dark.svg"

  document.getElementById('logoGifo').src = 'assests/img/gifOF_logo_dark.png'
  buttonCaptureIcon.src = 'assests/img/camera_light.svg'
}

function changeThemeDay() {

  document.getElementById('sheetStyle').href = "assests/styles/themeDay.css"
  localStorage.setItem('themeActive', 'day-theme')

  document.getElementById('logoGifo').src = 'assests/img/gifOF_logo.png'
  document.getElementById('fotoLupa').src = 'assests/img/lupa_inactive.svg'

  nightThemeButton.classList = ''
  dayThemeButton.classList = 'theme-active'

  dayThemeButton.removeEventListener('click', changeThemeDay)

  nightThemeButton.addEventListener('click', changeThemeNight)
  dropdownOptions.classList.toggle('hidden')
}



function showCameraPreview() {

  boxTittle.textContent = 'Un Chequeo Antes de Empezar'
  uploadContaint.classList.toggle('hidden')
  document.getElementById('container-information').classList.toggle('hidden')
  document.getElementById('button-re-capture').addEventListener('click', recapturar)

  startCamera()

}

function startCamera() {
  let video = document.querySelector('video')
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
  }).then((stream) => {
    camStream = stream;
    video.srcObject = stream;
    video.play()
    buttonCapture.addEventListener('click', startRecord)

  }).catch(error => {
    alert('Necesitamos los permisos para que grabes tu Gif');
    console.log(error);
  });
};

function recordGif() {
  recorder = createGifRecorder(camStream);
  recorder.startRecording();
  recording = true;
}


function startRecord() {

  buttonCapture.removeEventListener('click', startRecord)
  buttonCaptureIcon.src = 'assests/img/recording.svg'
  buttonCaptureText.innerHTML = "Listo"
  buttonCaptureIcon.classList.add('recording')
  buttonCaptureText.classList.add('recording')
  document.getElementById('time-count').classList.replace('visibility-hidden', 'nav-item')
  boxTittle.textContent = "Capturando Tu Guifo"
  buttonCapture.addEventListener('click', previewRecord)
  document.getElementById("timer-clock").innerHTML = "00:00:00:00"
  recordGif()
  cronometrar()
}


function createGifRecorder(stream) {
  return RecordRTC(stream, {
    type: 'gif',
    frameRate: 1,
    quality: 10,
    width: 360,
    hidden: 240,
    onGifRecordingStarted: () => console.log('started')
  });
};

async function previewRecord() {
  await recorder.stopRecording(stopRecord);
  camStream.getTracks().forEach(track => track.stop());
  console.log('pasé por parar')
  boxTittle.textContent = "Vista previa"
  clearInterval(intervalo)
  createProgressBar(17)
  showRecordedButtons()
}


function stopRecord() {
  parar()
  videoBlob = recorder.getBlob();
  console.log(form.get('file'))
  mediaContainer.innerHTML = '<img class="gif-preview" src="" id="gif-preview"></img>'
  let gifPreview = document.getElementById('gif-preview')
  gifPreview.src = URL.createObjectURL(videoBlob);
  buttonCapture.removeEventListener('click', previewRecord)
  buttonCapture.addEventListener('click', upLoadingStatus)
  
  recorder.destroy();
  recorder = null;
}

function upLoadingStatus() {

  boxTittle.innerHTML = "Subiendo Guifo"

  mediaContainer.innerHTML = ''
  const div = document.createElement('div')
  div.className = 'upload-view'
  const img = document.createElement('img')
  img.src = 'assests/img/globe_img.png'
  img.alt = 'Imagen globo terraqueo'
  div.appendChild(img)
  const p = document.createElement('p')
  p.classList = ('text-create')
  p.innerHTML = 'Estamos Subiendo tu guifo'
  div.appendChild(p)
  const divBar = document.createElement('div')
  divBar.className = 'prueba1'
  divBar.id = 'progress-bar-upload'
  divBar.appendChild(uploadProgressBar());
  div.appendChild(divBar)
  const pieMsg = p.cloneNode(true)
  pieMsg.innerHTML = 'Tiempo restante: <strike>38 años</strike> algunos minutos'
  pieMsg.classList = 'time-remaining'
  div.appendChild(pieMsg)

  mediaContainer.appendChild(div)

  document.getElementById('time-count').classList.replace('nav-item', 'visibility-hidden')
  document.getElementById('progressbar-li').classList.add('visibility-hidden')
  document.getElementById('container-time-bar').innerHTML = ''
  document.getElementById('recapture-text').innerHTML = 'Cancelar'
  buttonCapture.classList.replace('upload-item', 'hidden')

  upLoadGifo()
}

function upLoadGifo() {
  form = new FormData()
  form.append('file', videoBlob, 'myGif.gif');

  let = URLBASE = 'https://upload.giphy.com/v1/gifs'

  boxTittle.innerHTML = "Subiendo Guifo"

  fetch('https://upload.giphy.com/v1/gifs?api_key=' + APIKEY,
    {
      method: 'post',
      body: form
    })
    .then(response => {
      return response.json()
    })

    .then(data => {
      console.log(data.data.id)
      objetoDevuelto = data
      succesfullUpload(data.data.id)

    })

    .catch(function (error) {
      window.alert('El error es ..' + error)
      return error
    })
}

async function succesfullUpload(idGuifo) {

  guifo = await fetch('https://api.giphy.com/v1/gifs/' + idGuifo + '?api_key=' + APIKEY)
    .then(response => { return response.json() })
  console.log(idGuifo)



  boxTittle.innerHTML = 'Guifo Subido Con Éxito'
  mediaContainer.innerHTML = `<img class="upload-guifo" src="${guifo.data.images.downsized_medium.url}" id="gif-preview"></img>`

  mediaContainer.classList.replace('media-container', 'media-container-small')
  uploadContaint.classList.replace('upload-container', 'upload-container-small')

  document.getElementById('new-guifo-buttons').classList = 'new-guifo-menu d-flex'

  let subTitle = document.createElement('h6')
  subTitle.classList = 'text-create'
  subTitle.textContent = 'Guifo creado con éxito'

  document.getElementById('new-guifo-buttons').appendChild(subTitle)

  let buttonLink = document.createElement('button')
  buttonLink.classList = 'upload-buttons'
  buttonLink.textContent = 'Copiar Enlace Guifo'
  buttonLink.url = guifo.data.url
  buttonLink.addEventListener('click', function () {
    navigator.clipboard.writeText(buttonLink.url)
    alert('¡Enlace copiado al portapapeles!')
  })
  document.getElementById('new-guifo-buttons').appendChild(buttonLink)
  let buttonDownload = document.createElement('button')
  buttonDownload.classList = 'upload-buttons'
  buttonDownload.textContent = 'Descargar Guifo'

  buttonDownload.addEventListener('click', downloadNewGif)

  document.getElementById('new-guifo-buttons').appendChild(buttonDownload)
  mediaContainer.parentNode.classList.add('success-container')

  buttonCapture.classList.remove('hidden')
  buttonCapture.removeEventListener('click', upLoadingStatus)
  buttonCaptureText.innerHTML = 'Listo'
  buttonCaptureText.addEventListener('click', reiniciar)
  document.getElementById('recapture-li').classList.replace('nav-item', 'hidden')

  checkMisGifos()
}


async function downloadNewGif() {

  const downloadUrl = `https://media.giphy.com/media/${guifo.data.id}/giphy.gif`;
  const fetchedGif = fetch(downloadUrl);
  const blobGif = (await fetchedGif).blob();
  const urlGif = URL.createObjectURL(await blobGif);
  const saveImg = document.createElement("a");
  saveImg.href = urlGif;
  saveImg.download = "downloaded-guifo.gif";
  saveImg.style = 'display: "none"';
  document.body.appendChild(saveImg);
  saveImg.click();
  document.body.removeChild(saveImg);

}


function reiniciar() {

  mediaContainer.classList.replace('media-container-small', 'media-container')
  uploadContaint.classList.replace('upload-container-small', 'upload-container')
  mediaContainer.parentNode.classList.remove('success-container')

  document.getElementById('new-guifo-buttons').innerHTML = ''
  document.getElementById('new-guifo-buttons').classList = 'hidden'
  buttonCaptureText.innerHTML = 'Capturar'

  mediaContainer.innerHTML = ' <video class="" src="" id="vista-camara"></video>'

  uploadContaint.classList.toggle('hidden')
  document.getElementById('container-information').classList.toggle('hidden')
  document.getElementById('recapture-text').innerHTML = 'Repetir Captura'
  document.getElementById('mygifs-gallery').innerHTML = ''

  buttonCaptureText.removeEventListener('click', reiniciar)

}

function checkMisGifos() {

  let misGifosSubidos = localStorage.getItem('misGifos')

  if (misGifosSubidos == null) {
    console.log('paso por null')
    misGifosSubidos = guifo.data.id

  }

  else {

    misGifosSubidos = misGifosSubidos + ',' + guifo.data.id

  }

  console.log(misGifosSubidos)
  localStorage.setItem('misGifos', misGifosSubidos)

  renderMyGifsGallery()

}

async function renderMyGifsGallery() {

  let misGifos = localStorage.getItem('misGifos')

  let APIKEY = "gQI6Rlg7k278ElyIYGIW7pRogbFniBkT"
  let data = await fetch(`https://api.giphy.com/v1/gifs?ids=${misGifos}&api_key=${APIKEY}`)
    .then(response => { return response.json() })

  const myGifsGallery = document.getElementById('mygifs-gallery')

  myGifsGallery.innerHTML = ''
  console.log(data.data)
  data.data.forEach(element => {
    const div = document.createElement('div')

    div.className = 'trending-gallery-item'
    div.style.background = `url(${element.images.fixed_height.url}) no-repeat center`
    div.style.backgroundSize = 'cover'

    myGifsGallery.appendChild(div)
  });
}



function cronometrar() {
  h = 0;
  m = 0;
  s = 0;
  cs = 0

  intervalo = setInterval(escribir, 10);
  escribir();
}

function parar() {

}

function recapturar() {

  claseBoton = buttonCapture.classList.contains('hidden')

  if (claseBoton = true) {
    buttonCapture.classList.replace('hidden', 'upload-item')

  }
  buttonCaptureText.innerHTML = "Capturar"
  buttonCaptureIcon.classList.replace('hidden', 'primary-button')
  document.getElementById('time-count').classList.replace('nav-item', 'visibility-hidden')
  document.getElementById("timer-clock").innerHTML = "00:00:00:00"
  document.getElementById('recapture-li').classList.replace('nav-item', 'hidden')
  document.getElementById('progressbar-li').classList.add('visibility-hidden')
  buttonCapture.removeEventListener('click', upLoadingStatus)
  mediaContainer.innerHTML = ' <video class="" src="" id="vista-camara"></video>'
  let cameraLight = 'assests/img/camera.svg'
  let cameraDark = 'assests/img/camera_light.svg'

  activeTheme == 'day-theme' ? buttonCaptureIcon.src = cameraLight : buttonCaptureIcon.src = cameraDark


  startCamera()
}

function obtenerGifos2() {
  // let APIKEY = "gQI6Rlg7k278ElyIYGIW7pRogbFniBkT"
  fetch(`https://api.giphy.com/v1/gifs/GoOzV0xaemMdiA9ydr?api_key=${APIKEY}`)
    .then(response => { return response.json() })
    .then(data => console.log(data.data))

}

// funciones auxiliares

function createProgressBar(parts) {
  const containerTimeBar = document.getElementById('container-time-bar')
  containerTimeBar.innerHTML = ""
  for (let i = 0; i < parts; i++) {
    const span = document.createElement('span');
    span.classList.add('progress-part')
    containerTimeBar.appendChild(span)
  }
}

function showRecordedButtons() {
  document.getElementById('progressbar-li').classList.remove('visibility-hidden')
  buttonCaptureIcon.classList.remove('recording')
  buttonCaptureIcon.classList.replace('primary-button', 'hidden')
  buttonCaptureText.classList.remove('recording')
  buttonCaptureText.innerHTML = "Subir Guifo"
  document.getElementById('recapture-li').classList.replace('hidden', 'nav-item')

}

function escribir() {

  var hAux, mAux, sAux, csAux;
  cs++;
  if (cs > 99) { s++; cs = 0; }
  if (s > 59) { m++; s = 0; }
  if (m > 59) { h++; m = 0; }
  if (h > 24) { h = 0; }

  if (cs < 10) { csAux = "0" + cs; } else { csAux = cs; }
  if (s < 10) { sAux = "0" + s; } else { sAux = s; }
  if (m < 10) { mAux = "0" + m; } else { mAux = m; }
  if (h < 10) { hAux = "0" + h; } else { hAux = h; }

  document.getElementById("timer-clock").innerHTML = hAux + ":" + mAux + ":" + sAux + ":" + csAux;
}

function uploadProgressBar() {
  let bar = document.createElement('div')
  bar.classList = 'container-time-upload'
  for (let i = 0; i < 23; i++) {
    const span = document.createElement('span');
    span.classList.add('progress-part')
    bar.appendChild(span)
  }
  return bar
}
