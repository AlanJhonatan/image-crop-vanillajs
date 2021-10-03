export default class CroppingTool {

  constructor() {
    // Making this own reference to fix scope problems
    this.instance = this;

    // Storing all elements that needs
    this.photoPreview = document.getElementById('photo-preview');
    this.selectionTool = document.getElementById('selection-tool');
    this.cropButton = document.getElementById('crop-image');

    // Binding all events, passing some needed args
    Object.keys(this.cropEvents).map((eventName) => {
      this.photoPreview.addEventListener(eventName, (event) => this.cropEvents[eventName](event,{
        photoPreview: this.photoPreview,
        selectionTool: this.selectionTool,
        cropButton: this.cropButton,
        instance: this.instance,
      }));
    });
  }

  cropEvents = {
    mouseover(event, { photoPreview }){
      photoPreview.style.cursor = 'crosshair';
    },
    mousedown(event, { instance }){
      const { clientX, clientY, offsetX, offsetY } = event;

      instance.isCropping = true;

      instance.startX = clientX;
      instance.startY = clientY;
      instance.relativeStartX = offsetX;
      instance.relativeStartY = offsetY;
    },
    mousemove(event, { selectionTool, instance }){
      const { clientX, clientY } = event;

      // Stop cropping if not cropping
      if(!instance.isCropping)
        return;

      instance.endX = clientX;
      instance.endY = clientY;

      selectionTool.style.display = 'initial';
      selectionTool.style.left = `${instance.startX}px`;
      selectionTool.style.top = `${instance.startY}px`;

      selectionTool.style.width = `${instance.endX - instance.startX}px`;
      selectionTool.style.height = `${instance.endY - instance.startY}px`;
    },
    mouseup(event, { cropButton, instance }){
      const { layerX, layerY } = event;

      instance.isCropping = false;

      instance.relativeEndX = layerX;
      instance.relativeEndY = layerY;

      cropButton.style.display = 'initial';
    },
  }
}