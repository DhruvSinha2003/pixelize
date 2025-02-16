import { Download, Image as ImageIcon, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import colorPalettes from "./palettes";
import themes from "./themes";

class PixelArt {
  constructor(config = {}) {
    this.canvas = config.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.scale = config.scale || 0.08;
    this.palette = config.palette || colorPalettes.default;
  }

  async process(image) {
    this.canvas.width = image.width;
    this.canvas.height = image.height;

    this.ctx.drawImage(image, 0, 0);

    if (this.scale < 1) {
      const scaledW = this.canvas.width * this.scale;
      const scaledH = this.canvas.height * this.scale;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = this.canvas.width;
      tempCanvas.height = this.canvas.height;
      const tempCtx = tempCanvas.getContext("2d");

      tempCtx.drawImage(image, 0, 0, scaledW, scaledH);

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
    }

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

const PixelArtConverter = () => {
  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(0.5);
  const [selectedPalette, setSelectedPalette] = useState("default");
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef(null);
  const pixelArtRef = useRef(null);
  const currentTheme = themes[selectedPalette];

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
  const styles = {
    container: {
      backgroundColor: currentTheme.background,
      color: currentTheme.text,
    },
    card: {
      backgroundColor: `rgba(${currentTheme.primary
        .match(/\d+/g)
        .map((n) => Math.min(parseInt(n) + 20, 255))
        .join(", ")}, 0.1)`,
      borderColor: currentTheme.border,
    },
    title: {
      color: currentTheme.accent,
    },
    uploadArea: {
      borderColor: isDragging ? currentTheme.accent : currentTheme.border,
      backgroundColor: `rgba(${currentTheme.primary
        .match(/\d+/g)
        .join(", ")}, 0.1)`,
    },
    button: {
      backgroundColor: currentTheme.accent,
      color: currentTheme.text,
    },
    select: {
      backgroundColor: `rgba(${currentTheme.primary
        .match(/\d+/g)
        .join(", ")}, 0.2)`,
      borderColor: currentTheme.border,
      color: currentTheme.text,
    },
    canvas: {
      borderColor: currentTheme.border,
      backgroundColor: `rgba(${currentTheme.primary
        .match(/\d+/g)
        .join(", ")}, 0.1)`,
    },
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
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
    if (img && pixelArtRef.current) {
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
    <div className="min-h-screen" style={styles.container}>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="rounded-lg shadow-xl p-6" style={styles.card}>
          <h1
            className="text-3xl font-bold mb-6 text-center"
            style={styles.title}
          >
            Pixelize
          </h1>

          <div className="space-y-6">
            <div
              className="flex items-center justify-center w-full"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <label
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200"
                style={styles.uploadArea}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {image ? (
                    <ImageIcon
                      className="w-10 h-10 mb-3"
                      style={{ color: currentTheme.accent }}
                    />
                  ) : (
                    <Upload
                      className="w-10 h-10 mb-3"
                      style={{ color: currentTheme.accent }}
                    />
                  )}
                  <p className="mb-2 text-sm">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs opacity-70">PNG, JPG, WEBP</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Pixel Scale: {(scale * 100).toFixed(1)}%
              </label>
              <input
                type="range"
                min="0.01"
                max="1"
                step="0.01"
                value={scale}
                onChange={handleScaleChange}
                className="w-full"
                style={{ accentColor: currentTheme.accent }}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Color Palette</label>
              <select
                value={selectedPalette}
                onChange={handlePaletteChange}
                className="block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none"
                style={styles.select}
              >
                {Object.keys(colorPalettes).map((palette) => (
                  <option key={palette} value={palette}>
                    {palette.charAt(0).toUpperCase() + palette.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {image && (
            <div>
              <div className="mt-6">
                <canvas
                  ref={canvasRef}
                  className="max-w-full border rounded-lg"
                  style={styles.canvas}
                />
              </div>

              <div className="mt-4">
                <button
                  onClick={handleSaveImage}
                  className="flex items-center justify-center px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
                  style={styles.button}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Save Image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PixelArtConverter;
