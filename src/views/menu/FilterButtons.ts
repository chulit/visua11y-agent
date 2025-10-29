import monochromeIcon from "../../icons/monochromeIcon.svg"
import lowSaturationIcon from "../../icons/lowSaturationIcon.svg"
import highSaturationIcon from "../../icons/highSaturationIcon.svg"
import highContrastIcon from "../../icons/highContrastIcon.svg"
import invertColorsIcon from "../../icons/invertColorsIcon.svg"
import imageDesaturationIcon from "../../icons/imageDesaturationIcon.svg"

export default [
    {
        label: 'Contrast',
        key: 'contrast-cycle',
        icon: highContrastIcon,
        steps: ['Dark Contrast', 'Light Contrast', 'High Contrast'],
    },
    {
        label: 'Invert Colors',
        key: 'invert-colors',
        icon: invertColorsIcon,
    },
    {
        label: 'Low Saturation',
        key: 'low-saturation',
        icon: lowSaturationIcon,
    },
    {
        label: 'High Saturation',
        key: 'high-saturation',
        icon: highSaturationIcon,
    },
    {
        label: 'Monochrome',
        key: 'monochrome',
        icon: monochromeIcon,
    },
    {
        label: 'Image Desaturation',
        key: 'image-desaturation',
        icon: imageDesaturationIcon,
    },
    // Legacy direct contrast buttons removed in favour of cycle button.
];
