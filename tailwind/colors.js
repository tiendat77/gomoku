const chroma = require('chroma-js');
const lodash = require('lodash');
const plugin = require('tailwindcss/plugin');
const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default;

const generateContrasts = (palette) => {
  const lightColor = '#FFFFFF';
  let darkColor = '#FFFFFF';

  // Iterate through the palette to find the darkest color
  lodash.forEach(palette, (color) => {
    darkColor =
      chroma.contrast(color, '#FFFFFF') > chroma.contrast(darkColor, '#FFFFFF')
        ? color
        : darkColor;
  });

  // Generate the contrasting colors
  return lodash.fromPairs(
    lodash.map(palette, (color, hue) => [
      hue,
      chroma.contrast(color, darkColor) > chroma.contrast(color, lightColor)
        ? darkColor
        : lightColor,
    ])
  );
};

const normalizeTheme = (theme) => {
  return lodash.fromPairs(
    lodash.map(
      lodash.omitBy(
        theme,
        (palette, paletteName) =>
          paletteName.startsWith('on') || lodash.isEmpty(palette)
      ),
      (palette, paletteName) => [
        paletteName,
        {
          ...palette,
          DEFAULT: palette['DEFAULT'] || palette[500],
        },
      ]
    )
  );
};

const generateVariableColors = (theme) => {
  // https://github.com/adamwathan/tailwind-css-variable-text-opacity-demo
  const customPropertiesWithOpacity =
    (name) =>
    ({ opacityVariable, opacityValue }) => {
      if (opacityValue) {
        return `rgba(var(--${name}-rgb), ${opacityValue})`;
      }
      if (opacityVariable) {
        return `rgba(var(--${name}-rgb), var(${opacityVariable}, 1))`;
      }
      return `rgb(var(--${name}-rgb))`;
    };

  return lodash.fromPairs(
    lodash.flatten(
      lodash.map(
        lodash.keys(flattenColorPalette(normalizeTheme(theme))),
        (name) => [
          [name, customPropertiesWithOpacity(name)],
          [`on-${name}`, customPropertiesWithOpacity(`on-${name}`)],
        ]
      )
    )
  );
};

module.exports = plugin.withOptions(
  (options) => ({ addComponents }) => {
    const mapVariableColors = lodash.fromPairs(
      lodash.flatten(
      lodash.map(
        flattenColorPalette(
          lodash.fromPairs(
            lodash.flatten(
              lodash.map(normalizeTheme(options.themes), (palette, paletteName) => [
                [paletteName, palette],
                [
                  `on-${paletteName}`,
                  lodash.fromPairs(
                    lodash.map(generateContrasts(palette), (color, hue) => [
                      hue,
                      lodash.get(options.themes, [`on-${paletteName}`, hue]) || color,
                    ])
                  ),
                ],
              ])
            )
          )
        ),
        (value, key) => [
          [`--${key}`, value],
          [`--${key}-rgb`, chroma(value).rgb().join(',')],
        ]
      )
    ));

    addComponents({
      body: mapVariableColors
    });
  },
  (options) => {
    return {
      theme: {
        extend: {
          colors: generateVariableColors(options.themes),
        },
      },
    };
  }
);