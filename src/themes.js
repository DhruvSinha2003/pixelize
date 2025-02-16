import colorPalettes from "./palettes";

const createThemeFromPalette = (palette) => {
  const [primary] = palette;
  const [secondary] = palette.slice(-1);
  const [accent] = palette.slice(
    Math.floor(palette.length / 2),
    Math.floor(palette.length / 2) + 1
  );

  return {
    primary: `rgb(${primary.join(",")})`,
    secondary: `rgb(${secondary.join(",")})`,
    accent: `rgb(${accent.join(",")})`,
    background: `rgb(${Math.max(primary[0] - 20, 0)}, ${Math.max(
      primary[1] - 20,
      0
    )}, ${Math.max(primary[2] - 20, 0)})`,
    text: `rgb(${Math.min(primary[0] + 150, 255)}, ${Math.min(
      primary[1] + 150,
      255
    )}, ${Math.min(primary[2] + 150, 255)})`,
    border: `rgb(${Math.min(primary[0] + 50, 255)}, ${Math.min(
      primary[1] + 50,
      255
    )}, ${Math.min(primary[2] + 50, 255)})`,
  };
};

const themes = Object.fromEntries(
  Object.entries(colorPalettes).map(([key, palette]) => [
    key,
    createThemeFromPalette(palette),
  ])
);

export default themes;
