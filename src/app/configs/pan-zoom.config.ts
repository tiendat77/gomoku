import { PanZoomConfigOptions } from '@libs/panzoom';

export const PANZOOM_CONFIG: PanZoomConfigOptions = {
  zoomLevels: 3,
  scalePerZoomLevel: 2.0,
  initialZoomToFit: {
    x: 0,
    y: 0,
    width: 640,
    height: 640
  },
  neutralZoomLevel: 1,
  zoomOnMouseWheel: false,
  zoomToFitZoomLevelFactor: 1,
};
