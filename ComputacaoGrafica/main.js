var fileLoader = document.getElementById("fileLoader");
var image = document.getElementById("image");
var canvas = document.getElementById("image-canvas");
var context = null;

let loadFromFile = function () {
  fileLoader.click();
  fileLoader.addEventListener("input", () => {
    image.src = fileLoader.files[0].name;
  });
};

let load = function () {
  context = canvas.getContext("2d");
  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0);
};

let grayScale = function () {
  let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  let img = new MatrixImage(imageData);
  for (var i = 0; i < img.width; i++) {
    for (var j = 0; j < img.height; j++) {
      var pixel = img.getPixel(i, j);
      var gray = (pixel.red + pixel.green + pixel.blue) / 3;
      img.setPixel(i, j, new RGBColor(gray, gray, gray));
    }
  }
  context.putImageData(img.imageData, 0, 0);
};

let mean = function () {
  let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  let img = new MatrixImage(imageData);
  for (var i = 2; i < img.width - 2; i++) {
    for (var j = 2; j < img.height - 2; j++) {
      var pixel = Array();
      pixel.push(img.getPixel(i - 1, j - 1).red);
      pixel.push(img.getPixel(i - 1, j).red);
      pixel.push(img.getPixel(i, j - 1).red);
      pixel.push(img.getPixel(i + 1, j - 1).red);
      pixel.push(img.getPixel(i, j).red);
      pixel.push(img.getPixel(i - 1, j + 1).red);
      pixel.push(img.getPixel(i, j + 1).red);
      pixel.push(img.getPixel(i + 1, j).red);
      pixel.push(img.getPixel(i + 1, j + 1).red);
      var gray = pixel.reduce((a, b) => a + b, 0) / 9;

      img.setPixel(i, j, new RGBColor(gray, gray, gray));
    }
  }
  context.putImageData(img.imageData, 0, 0);
};

class RGBColor {
  constructor(r, g, b) {
    this.red = r;
    this.green = g;
    this.blue = b;
  }
}

class MatrixImage {
  constructor(imageData) {
    this.imageData = imageData;
    this.height = imageData.height;
    this.width = imageData.width;
  }

  getPixel(x, y) {
    let position = y * (this.width * 4) + x * 4;

    return new RGBColor(
      this.imageData.data[position], //red
      this.imageData.data[position + 1], //green
      this.imageData.data[position + 2] //blue
    );
  }

  setPixel(x, y, color) {
    let position = y * (this.width * 4) + x * 4;
    this.imageData.data[position] = color.red;
    this.imageData.data[position + 1] = color.green;
    this.imageData.data[position + 2] = color.blue;
  }
}

const gaussian = function (pixels) {
  const divider = 16;
  const operator = [
    1 / divider,
    2 / divider,
    1 / divider,
    2 / divider,
    4 / divider,
    2 / divider,
    1 / divider,
    2 / divider,
    1 / divider,
  ];

  return convolution(pixels, operator);
};

const blue = function (pixels) {
  let d = pixels.data;

  for (let i = 0; i < d.length; i += 4) {
    d[i] = 0;
    d[i + 1] = 0;
  }

  return pixels;
};

const red = function (pixels) {
  let d = pixels.data;

  for (let i = 0; i < d.length; i += 4) {
    d[i] = d[i];
    d[i + 1] = 0;
    d[i + 2] = 0;
  }

  return pixels;
};

const green = function (pixels) {
  let d = pixels.data;

  for (let i = 0; i < d.length; i += 4) {
    d[i] = 0;
    d[i + 2] = 0;
  }

  return pixels;
};

const invert = function (pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] = 255 - pixels.data[i];
    pixels.data[i + 1] = 255 - pixels.data[i + 1];
    pixels.data[i + 2] = 255 - pixels.data[i + 2];
  }

  return pixels;
};

document.getElementById("btnLoad").addEventListener("click", load); /*Carregar*/
document
  .getElementById("btnGray")
  .addEventListener("click", grayScale); /*Escala Cinza*/
document.getElementById("btnMean").addEventListener("click", mean); /*Média*/

document.getElementById("btnGau").addEventListener("click", gau); /*Gausiana*/
document.getElementById("btnRed").addEventListener("click", red); /*Red*/
document.getElementById("btnGree").addEventListener("click", blue); /*Green*/
document.getElementById("btnBlue").addEventListener("click", green); /*Blue*/
document.getElementById("btnInvert").addEventListener("click", invert); /*Inverter*/