const photoFile = document.getElementById('photo-file');
const selectImage = document.getElementById('select-image');
const photoPreview = document.getElementById('photo-preview');
const selectionTool = document.getElementById('selection-tool');
const cropButton = document.getElementById('crop-image');

let image;

selectImage.addEventListener('click', function () {
  photoFile.value = [];
  photoFile.click();
});

window.addEventListener('DOMContentLoaded', () => {
  photoFile.addEventListener('change', () => {
    let file = photoFile.files.item(0);

    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function (event) {
      image = new Image();
      image.src = event.target.result;
      image.onload = onLoadImage;
    }
  });
});

/* Selection Tool */

let
  startX,
  startY,
  relativeStartX,
  relativeStartY,
  endX,
  endY,
  relativeEndX,
  relativeEndY,
  isCropping;

const events = {
  mouseover(){
    this.style.cursor = 'crosshair';
  },
  mousedown(event){
    const { clientX, clientY, offsetX, offsetY } = event;

    isCropping = true;

    console.table({
      'client': [clientX, clientY],
      'offset': [offsetX, offsetY],
    });

    startX = clientX;
    startY = clientY;
    relativeStartX = offsetX;
    relativeStartY = offsetY;
  },
  mousemove(event){
    const {clientX, clientY} = event;

    if(!isCropping)
      return;

    endX = clientX;
    endY = clientY;

    selectionTool.style.display = 'initial';
    selectionTool.style.left = `${startX}px`;
    selectionTool.style.top = `${startY}px`;

    selectionTool.style.width = `${endX - startX}px`;
    selectionTool.style.height = `${endY - startY}px`;
  },
  mouseup(event){
    const { layerX, layerY } = event;
    
    isCropping = false;

    relativeEndX = layerX;
    relativeEndY = layerY;

    cropButton.style.display = 'initial';
  },
}

Object.keys(events).map(eventName => {
  photoPreview.addEventListener(eventName, events[eventName]);
})


/* Canvas */

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');

function onLoadImage() {
  const { width, height } = image;
  
  canvas.width = width;
  canvas.height = height;

  //clear context
  ctx.clearRect(0, 0, width, height);

  //desenhar a imagem
  ctx.drawImage(image, 0, 0);

  photoPreview.src = canvas.toDataURL();
}

/* crop image */
cropButton.onclick = () => {
  const { width: imgW, height: imgH } = image;
  const { width: prevW, height: prevH } = photoPreview;

  const [widthFactor, heightFactor] = [
    +(imgW / prevW),
    +(imgH / prevH)
  ];

  const [ selectionWidth, selectionHeight ] = [
    + (selectionTool.style.width.replace('px', '')),
    + (selectionTool.style.height.replace('px', '')),
  ];

  const [ croppedWidth, croppedHeight ] = [
    + (selectionWidth * widthFactor),
    + (selectionHeight * heightFactor),
  ];

  const [ actualX, actualY ] = [
    + (relativeStartX * widthFactor),
    + (relativeStartY * heightFactor)
  ];

  /* get from context the cropped image */
  const croppedImage = ctx.getImageData(actualX, actualY, croppedWidth, croppedHeight);

  // clear canvas context
  ctx.clearRect(0, 0, ctx.width, ctx.height);

  /* fixing proportions */
  image.width = canvas.width = croppedWidth;
  image.height = canvas.height = croppedHeight;

  // add cropped image to ctx
  ctx.putImageData(croppedImage, 0, 0);

  // hide selection tool
  selectionTool.style.display = 'none';

  // hide the crop button
  cropButton.style.display = 'none';

  // update the image preview
  photoPreview.src = canvas.toDataURL()
}