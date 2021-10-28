const APIKEY = 'gQI6Rlg7k278ElyIYGIW7pRogbFniBkT'
var activeTheme 


document.getElementById('start-button').addEventListener('click', showCameraPreview)


document.addEventListener('DOMContentLoaded', e => {
  renderMyGifsGallery()

  document.getElementById('start-button').addEventListener('click', showCameraPreview)
  activeTheme = localStorage.getItem('themeActive')

  // checkActiveTheme(localStorage.getItem('themeActive'))
    checkActiveTheme(activeTheme)

	console.log(localStorage.getItem('themeActive'))
});

function checkActiveTheme(theme) {

	if(theme == null){
		localStorage.setItem('themeActive', 'day-theme')
		activeTheme = 'day-theme'
	}
	else if(theme == "night-theme")   {

		changeThemeNight()
	}

}


function changeThemeNight() {
  document.getElementById('sheetStyle').href = "assests/styles/themeNight.css"
  document.getElementById('arrow').src = "assests/img/arrow_dark.svg"

	document.getElementById('logoGifo').src ='assests/img/gifOF_logo_dark.png'
	document.getElementById('capture-icon').src ='assests/img/camera_light.svg'
}

function changeThemeDay() {

	document.getElementById('sheetStyle').href = "assests/styles/themeDay.css"
	localStorage.setItem('themeActive', 'day-theme')
	
	document.getElementById('logoGifo').src ='assests/img/gifOF_logo.png'
	document.getElementById('fotoLupa').src ='assests/img/lupa_inactive.svg'

	nightThemeButton.classList = ''
	dayThemeButton.classList = 'theme-active'

	dayThemeButton.removeEventListener('click',changeThemeDay)

	nightThemeButton.addEventListener('click',changeThemeNight)
	dropdownOptions.classList.toggle('hidden')
}



function showCameraPreview() {

  document.getElementById('box-tittle').textContent = 'Un Chequeo Antes de Empezar'
  document.getElementById('upload-container').classList.toggle('hidden')
  document.getElementById('container-information').classList.toggle('hidden')
  document.getElementById('button-re-capture').addEventListener('click', recapturar)

  getStreamAndRecord()

}

const properties = { audio: false, video: { height: { max: 480 } } }

let recorder

async function getStreamAndRecord() {
  var video = document.querySelector('video')
  mediaStream = await navigator.mediaDevices.getUserMedia(properties)
    .then(async function (mediaStream) {
      video.srcObject = mediaStream;
      video.play();
      recorder = await new RecordRTC(mediaStream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        onGifRecordingStarted: () => {
          console.log('pasé por aquí')
        },
      });
      recorder.camera = mediaStream
    })

  document.getElementById('button-capture').addEventListener('click', startRecord)

}

function upLoadingStatus() {

  document.getElementById('box-tittle').innerHTML = "Subiendo Guifo"

  document.getElementById('media-container').innerHTML = ''
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

  document.getElementById('media-container').appendChild(div)

  document.getElementById('time-count').classList.replace('nav-item', 'visibility-hidden')
  document.getElementById('progressbar-li').classList.add('visibility-hidden')
  document.getElementById('container-time-bar').innerHTML = ''
  document.getElementById('recapture-text').innerHTML = 'Cancelar'
  document.getElementById('button-capture').classList.replace('upload-item', 'hidden')

  upLoadGifo()
}

function upLoadGifo() {

  let = URLBASE = 'https://upload.giphy.com/v1/gifs'

  document.getElementById('box-tittle').innerHTML = "Subiendo Guifo"

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


let guifo

async function succesfullUpload(idGuifo) {

  guifo = await fetch('https://api.giphy.com/v1/gifs/' + idGuifo + '?api_key=' + APIKEY)
    .then(response => { return response.json() })
  console.log(idGuifo)



  document.getElementById('box-tittle').innerHTML = 'Guifo Subido Con Éxito'
  document.getElementById('media-container').innerHTML = `<img class="upload-guifo" src="${guifo.data.images.downsized_medium.url}" id="gif-preview"></img>`

  document.getElementById('media-container').classList.replace('media-container', 'media-container-small')
  document.getElementById('upload-container').classList.replace('upload-container', 'upload-container-small')

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
  document.getElementById('media-container').parentNode.classList.add('success-container')

  document.getElementById('button-capture').classList.remove('hidden')
  document.getElementById('button-capture').removeEventListener('click', upLoadingStatus)
  document.getElementById('capture-text').innerHTML = 'Listo'
  document.getElementById('capture-text').addEventListener('click', reiniciar)
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

  document.getElementById('media-container').classList.replace('media-container-small', 'media-container')
  document.getElementById('upload-container').classList.replace('upload-container-small', 'upload-container')
  document.getElementById('media-container').parentNode.classList.remove('success-container')

  document.getElementById('new-guifo-buttons').innerHTML = ''
  document.getElementById('new-guifo-buttons').classList = 'hidden'
  document.getElementById('capture-text').innerHTML = 'Capturar'

  document.getElementById('media-container').innerHTML = ' <video class="" src="" id="vista-camara"></video>'

  document.getElementById('upload-container').classList.toggle('hidden')
  document.getElementById('container-information').classList.toggle('hidden')
  document.getElementById('recapture-text').innerHTML = 'Repetir Captura'
  document.getElementById('mygifs-gallery').innerHTML = ''

  document.getElementById('capture-text').removeEventListener('click', reiniciar)

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

  myGifsGallery.innerHTML=''
  console.log(data.data)
  data.data.forEach(element => {
    const div = document.createElement('div')

    div.className = 'trending-gallery-item'
    div.style.background = `url(${element.images.fixed_height.url}) no-repeat center`
    div.style.backgroundSize = 'cover'

    myGifsGallery.appendChild(div)
  });
}





async function startRecord() {



  document.getElementById('button-capture').removeEventListener('click', startRecord)
  document.getElementById('capture-icon').src = 'assests/img/recording.svg'
  document.getElementById('capture-text').innerHTML = "Listo"
  document.getElementById('capture-icon').classList.add('recording')
  document.getElementById('capture-text').classList.add('recording')
  document.getElementById('time-count').classList.replace('visibility-hidden', 'nav-item')
  document.getElementById('box-tittle').textContent = "Capturando Tu Guifo"
  document.getElementById('button-capture').addEventListener('click', stopRecord)
  document.getElementById("timer-clock").innerHTML = "00:00:00:00"

  await recorder.startRecording()
  cronometrar()
}


let form = new FormData()

let videoBlob

async function stopRecord() {

  await recorder.stopRecording(
    async function () {
      parar()
      videoBlob = await recorder.getBlob();
      form = new FormData()
      form.append('file', videoBlob, 'myGif.gif');
      console.log(form.get('file'))

      document.getElementById('media-container').innerHTML = '<img class="gif-preview" src="" id="gif-preview"></img>'
      let gifPreview = document.getElementById('gif-preview')
      gifPreview.src = URL.createObjectURL(videoBlob);
      document.getElementById('button-capture').removeEventListener('click', stopRecord)
      document.getElementById('button-capture').addEventListener('click', upLoadingStatus)

      await recorder.camera.stop();
      await recorder.destroy();
      recorder = null;
      videoBlob = null
    }
  );
}


let intervalo
let h = 0;
let m = 0;
let s = 0;
let cs = 0;

function cronometrar() {
  h = 0;
  m = 0;
  s = 0;
  cs = 0

  intervalo = setInterval(escribir, 10);
  escribir();
}

function parar() {
  console.log('pasé por parar')
  document.getElementById('box-tittle').textContent = "Vista previa"
  clearInterval(intervalo)
  createProgressBar(17)
  showRecordedButtons()
}

function recapturar() {

  claseBoton = document.getElementById('button-capture').classList.contains('hidden')

  if (claseBoton = true) {
    document.getElementById('button-capture').classList.replace('hidden', 'upload-item')

  }
  document.getElementById('capture-text').innerHTML = "Capturar"
  document.getElementById('capture-icon').classList.replace('hidden', 'primary-button')
  document.getElementById('time-count').classList.replace('nav-item', 'visibility-hidden')
  document.getElementById("timer-clock").innerHTML = "00:00:00:00"
  document.getElementById('recapture-li').classList.replace('nav-item', 'hidden')
  document.getElementById('progressbar-li').classList.add('visibility-hidden')
  document.getElementById('button-capture').removeEventListener('click', upLoadingStatus)
  document.getElementById('button-capture').addEventListener('click', stopRecord)
  document.getElementById('media-container').innerHTML = ' <video class="" src="" id="vista-camara"></video>'
  let cameraLight ='assests/img/camera.svg'
  let cameraDark ='assests/img/camera_light.svg'
  
  activeTheme == 'day-theme' ?  document.getElementById('capture-icon').src = cameraLight : document.getElementById('capture-icon').src = cameraDark
  

  getStreamAndRecord()
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
  document.getElementById('capture-icon').classList.remove('recording')
  document.getElementById('capture-icon').classList.replace('primary-button', 'hidden')
  document.getElementById('capture-text').classList.remove('recording')
  document.getElementById('capture-text').innerHTML = "Subir Guifo"
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
