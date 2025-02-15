import { Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Simplified pixelation class
class PixelArt {
  constructor(config = {}) {
    this.canvas = config.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.scale = config.scale || 0.08;
    this.palette = config.palette || [
      [140, 143, 174],
      [88, 69, 99],
      [62, 33, 55],
      [154, 99, 72],
      [215, 155, 125],
      [245, 237, 186],
      [192, 199, 65],
      [100, 125, 52],
    ];
  }

  async process(image) {
    // Set canvas size
    this.canvas.width = image.width;
    this.canvas.height = image.height;

    // Draw original image
    this.ctx.drawImage(image, 0, 0);

    // Pixelate
    const scaledW = this.canvas.width * this.scale;
    const scaledH = this.canvas.height * this.scale;

    // Create temporary canvas for pixelation
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    const tempCtx = tempCanvas.getContext("2d");

    // Draw scaled down version
    tempCtx.drawImage(image, 0, 0, scaledW, scaledH);

    // Draw scaled up version
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.drawImage(
      tempCanvas,
      0,
      0,
      scaledW,
      scaledH,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    // Apply color palette
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    for (let i = 0; i < imageData.data.length; i += 4) {
      const color = this.findClosestColor([
        imageData.data[i],
        imageData.data[i + 1],
        imageData.data[i + 2],
      ]);
      imageData.data[i] = color[0];
      imageData.data[i + 1] = color[1];
      imageData.data[i + 2] = color[2];
    }
    this.ctx.putImageData(imageData, 0, 0);
  }

  findClosestColor(color) {
    return this.palette.reduce((closest, current) => {
      const currentDiff = Math.sqrt(
        Math.pow(color[0] - current[0], 2) +
          Math.pow(color[1] - current[1], 2) +
          Math.pow(color[2] - current[2], 2)
      );
      const closestDiff = Math.sqrt(
        Math.pow(color[0] - closest[0], 2) +
          Math.pow(color[1] - closest[1], 2) +
          Math.pow(color[2] - closest[2], 2)
      );
      return currentDiff < closestDiff ? current : closest;
    });
  }

  setScale(scale) {
    this.scale = scale;
  }

  setPalette(palette) {
    this.palette = palette;
  }
}

const colorPalettes = {
  default: [
    [140, 143, 174],
    [88, 69, 99],
    [62, 33, 55],
    [154, 99, 72],
    [215, 155, 125],
    [245, 237, 186],
    [192, 199, 65],
    [100, 125, 52],
  ],
  grayscale: [
    [0, 0, 0],
    [64, 64, 64],
    [128, 128, 128],
    [192, 192, 192],
    [255, 255, 255],
  ],
  sunset: [
    [45, 45, 45],
    [125, 45, 45],
    [195, 95, 95],
    [255, 145, 145],
    [255, 195, 195],
  ],
};

const PixelArtConverter = () => {
  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(0.08);
  const [selectedPalette, setSelectedPalette] = useState("default");
  const canvasRef = useRef(null);
  const pixelArtRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      pixelArtRef.current = new PixelArt({
        canvas: canvasRef.current,
        scale: scale,
        palette: colorPalettes[selectedPalette],
      });
    }
    processImage(image);
  }, [selectedPalette, scale, image]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          processImage(img);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (img) => {
    if (pixelArtRef.current) {
      pixelArtRef.current.setScale(scale);
      pixelArtRef.current.setPalette(colorPalettes[selectedPalette]);
      await pixelArtRef.current.process(img);
    }
  };

  const handleScaleChange = (e) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
    if (image) {
      processImage(image);
    }
  };

  const handlePaletteChange = (e) => {
    setSelectedPalette(e.target.value);
    if (image) {
      processImage(image);
    }
  };

  const handleSaveImage = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.href = canvasRef.current.toDataURL("image/png");
      link.download = "pixelated-image.png";
      link.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Pixel Art Converter</h1>

        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Pixel Scale: {(scale * 100).toFixed(1)}%
            </label>
            <input
              type="range"
              min="0.01"
              max="0.5"
              step="0.01"
              value={scale}
              onChange={handleScaleChange}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Color Palette
            </label>
            <select
              value={selectedPalette}
              onChange={handlePaletteChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="default">Default</option>
              <option value="grayscale">Grayscale</option>
              <option value="sunset">Sunset</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <canvas ref={canvasRef} className="max-w-full border rounded-lg" />
        </div>
        <div className="mt-4">
          <button
            onClick={handleSaveImage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
          >
            Save Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default PixelArtConverter;
