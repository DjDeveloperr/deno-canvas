// Just for testing, doesn't work correctly right now.
// This example is by https://github.com/AaronO

import { createCanvas } from "../mod.ts";
import * as chartjs from 'https://cdn.skypack.dev/chart.js';

function once(f) {
  let executed = false;
  return () => {
    if (executed) return;
    executed = true;
    f();
  };
}

// Init ChartJS globals
const globalInit = once(() => chartjs.Chart.register(...chartjs.registerables));

class DenoPlatform extends chartjs.BasePlatform {
  acquireContext(canvas, _) {
    return canvas.getContext("2d");
  }
}

export function render(width, height, chartjsConfig, imageType="image/png") {
  // Init globals once
  globalInit();

  // Create canvas
  const canvas = createCanvas(width, height);

  // Patch options
  chartjsConfig.options = chartjsConfig.options || {};
  chartjsConfig.options.responsive = false;
  chartjsConfig.options.animation = false;

  const chart = new chartjs.Chart(
    canvas,
    {
      ...chartjsConfig,
      platform: DenoPlatform,
    },
  );

  // Do render
  chart._initialize();
  chart.update();
  
  return canvas.toBuffer(imageType);
}

const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
];

const data = {
  labels: labels,
  datasets: [{
    label: 'My First dataset',
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: [0, 10, 5, 2, 20, 30, 45],
  }]
};

const config = {
  type: 'line',
  data: data,
};

await Deno.writeFile('image.png', render(900, 600, config));
