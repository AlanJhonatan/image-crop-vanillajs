import CroppingTool from './cropping-tool.js';

const photoFile = document.getElementById('photo-file');
const selectImage = document.getElementById('select-image');
const photoPreview = document.getElementById('photo-preview');
const selectionTool = document.getElementById('selection-tool');
const cropButton = document.getElementById('crop-image');
const imageGallery = document.getElementById('image-gallery');

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

// Cropping Tool
var cropTool = new CroppingTool();

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
    + (cropTool.relativeStartX * widthFactor),
    + (cropTool.relativeStartY * heightFactor)
  ];

  // Get from context the cropped image
  const croppedImage = ctx.getImageData(actualX, actualY, croppedWidth, croppedHeight);

  console.log(croppedImage);

  // Clear canvas context
  ctx.clearRect(0, 0, ctx.width, ctx.height);

  // Fixing proportions
  canvas.width = croppedWidth;
  canvas.height = croppedHeight;

  // Add cropped image to ctx
  ctx.putImageData(croppedImage, 0, 0);

  // Hide selection tool
  selectionTool.style.display = 'none';

  // Hide the crop button
  cropButton.style.display = 'none';

  let downloadCurrent = document.createElement('a')
  downloadCurrent.download = "cropped.jpg";
  downloadCurrent.href = canvas.toDataURL();

  let newImage = document.createElement('img');
  newImage.src = canvas.toDataURL();
  newImage.draggable = false;
  newImage.classList.add('gallery-img')

  document.getElementById('gallery-wrapper').style.display = 'initial';

  downloadCurrent.append(newImage);
  imageGallery.append(downloadCurrent);

  onLoadImage();
}