import colorPalettes from "./palettes";

const createThemeFromPalette = (palette, themeName) => {
  if (themeName === "default") {
    return {
      primary: "rgb(32, 34, 37)",
      secondary: "rgb(54, 57, 63)",
      accent: "rgb(114, 137, 218)",

      background: "rgb(32, 34, 37)",
      surfaceLight: "rgba(54, 57, 63, 0.3)",
      surfaceMedium: "rgba(54, 57, 63, 0.5)",
      surfaceDark: "rgba(47, 49, 54, 0.7)",

      buttonBg: "rgb(114, 137, 218)",
      buttonHover: "rgb(103, 123, 196)",
      buttonActive: "rgb(92, 109, 174)",

      textPrimary: "rgb(255, 255, 255)",
      textSecondary: "rgb(185, 187, 190)",
      textAccent: "rgb(144, 167, 248)",

      borderLight: "rgba(79, 84, 92, 0.3)",
      borderMedium: "rgba(79, 84, 92, 0.6)",
      borderAccent: "rgb(114, 137, 218)",

      optionBg: "rgb(47, 49, 54)",
      optionHover: "rgb(54, 57, 63)",
      optionText: "rgb(255, 255, 255)",
    };
  }

  const [primaryColor] = palette;
  const [accentColor] = palette.slice(
    Math.floor(palette.length * 0.3),
    Math.floor(palette.length * 0.3) + 1
  );
  const [secondaryColor] = palette.slice(
    Math.floor(palette.length * 0.7),
    Math.floor(palette.length * 0.7) + 1
  );

  const adjustColor = (rgb, amount) =>
    rgb.map((value) => Math.max(0, Math.min(255, value + amount)));

  const backgroundRGB = adjustColor(primaryColor, -20);
  const darkerPrimary = adjustColor(primaryColor, -40);
  const lighterPrimary = adjustColor(primaryColor, 40);
  const darkerAccent = adjustColor(accentColor, -40);
  const lighterAccent = adjustColor(accentColor, 40);

  return {
    primary: `rgb(${primaryColor.join(",")})`,
    secondary: `rgb(${secondaryColor.join(",")})`,
    accent: `rgb(${accentColor.join(",")})`,

    background: `rgb(${backgroundRGB.join(",")})`,
    surfaceLight: `rgba(${lighterPrimary.join(",")}, 0.1)`,
    surfaceMedium: `rgba(${lighterPrimary.join(",")}, 0.15)`,
    surfaceDark: `rgba(${darkerPrimary.join(",")}, 0.2)`,

    buttonBg: `rgb(${accentColor.join(",")})`,
    buttonHover: `rgb(${darkerAccent.join(",")})`,
    buttonActive: `rgb(${lighterAccent.join(",")})`,

    textPrimary: `rgb(${adjustColor(primaryColor, 200).join(",")})`,
    textSecondary: `rgb(${adjustColor(primaryColor, 150).join(",")})`,
    textAccent: `rgb(${adjustColor(accentColor, 40).join(",")})`,

    borderLight: `rgba(${lighterPrimary.join(",")}, 0.2)`,
    borderMedium: `rgba(${lighterPrimary.join(",")}, 0.3)`,
    borderAccent: `rgb(${accentColor.join(",")})`,

    optionBg: `rgb(${darkerPrimary.join(",")})`,
    optionHover: `rgb(${adjustColor(primaryColor, -10).join(",")})`,
    optionText: `rgb(${adjustColor(primaryColor, 180).join(",")})`,
  };
};

const themes = Object.fromEntries(
  Object.entries(colorPalettes).map(([key, palette]) => [
    key,
    createThemeFromPalette(palette, key),
  ])
);

export default themes;
