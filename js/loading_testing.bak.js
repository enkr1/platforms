// WIP: ---------------------------------------------------------------------------------
// Variables to track loading progress
let loadedItems = 0;
let totalItems = apiFetches.length;
let currentPercent = 0;
let loadingComplete = false;
let resourcesLoaded = false;
let progressInterval = null;

console.debug(`[Script Load] Loading script initialised.`);


// Update loading progress function, to track progress on each resource load
const updateLoadingProgress = () => {
  const percent = (loadedItems / totalItems) * 100;
  const delay = (percent < 50) ? 330 : ((percent < 80) ? 130 : 33);
  console.debug(`[updateLoadingProgress] Called with percent=${percent.toFixed(2)}, loadedItems=${loadedItems}, totalItems=${totalItems}`);
  updateLoadingProgressSmoothly(percent, delay);
};

// Smooth Progress Update Function
const updateLoadingProgressSmoothly = (targetPercent, delay = 50) => {
  if (progressInterval) clearInterval(progressInterval);
  const circle = document.getElementById("progress-circle-bottom");
  const loadingText = document.getElementById("loading-text");
  const totalLength = circle.getTotalLength();
  circle.style.strokeDasharray = `${totalLength}`;
  circle.style.strokeDashoffset = totalLength;
  circle.style.stroke = `#fff`;

  targetPercent = Math.min(targetPercent, 100);
  let currentStep = currentPercent;

  console.debug(`[Progress Update] Start smooth progress: currentPercent=${currentPercent}, targetPercent=${targetPercent}, delay=${delay}`);

  progressInterval = setInterval(() => {
    if (currentStep < targetPercent) {
      currentStep += 1;
      currentPercent = Math.min(currentStep, targetPercent);
      const dashOffset = totalLength * (1 - currentPercent / 100);
      circle.style.strokeDashoffset = dashOffset;
      loadingText.innerText = `${Math.floor(currentPercent)}%`;
      console.debug(`[Progress Update] Incrementing: currentStep=${currentStep}, dashOffset=${dashOffset}`);
    } else {
      clearInterval(progressInterval);
      console.debug(`[Progress Update] Smooth progress reached targetPercent: ${targetPercent}`);
      if (currentPercent >= 100 && !loadingComplete) {
        finaliseLoadingScreen();
      }
    }
  }, delay);
};

// Finalising Loading Screen
const finaliseLoadingScreen = () => {
  if (loadingComplete) return; // Prevent re-triggering
  loadingComplete = true;
  console.debug(`[Finalisation Attempt] Attempting to finalise loading screen`);

  setTimeout(() => {
    const overallBodyWrapper = document.getElementById("overall-body-wrapper");
    const loadingScreen = document.getElementById("loading-screen");

    if (overallBodyWrapper && loadingScreen) {
      overallBodyWrapper.style.display = "block";
      loadingScreen.style.opacity = "0";
      loadingScreen.style.zIndex = "-999";
      console.debug(`[Finalisation] Loading screen finalised and hidden`);
    } else {
      console.warn(`[Finalisation Warning] Elements not found, cannot hide loading screen.`);
    }
  }, 300);
};

// Start Resource Tracking
const startTrackingResources = async () => {
  if (resourcesLoaded) return;
  resourcesLoaded = true;
  console.debug("[startTrackingResources] Tracking resources initiated.");

  const fakeTargetPercent = 30;
  updateLoadingProgressSmoothly(fakeTargetPercent, 100);
  await new Promise(resolve => setTimeout(resolve, 3000));

  const images = [...document.querySelectorAll('img')].map(img => img.src);
  totalItems += images.length;
  console.debug(`[Image Load] Total items after adding images: totalItems=${totalItems}, image count=${images.length}`);
  const imagePromises = images.map(src => {
    return new Promise(resolve => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loadedItems++;
        updateLoadingProgress();
        resolve();
      };
    });
  });

  for (const url of apiFetches) {
    totalItems++;
    console.debug(`[Fetch Start] Incremented totalItems for API: totalItems=${totalItems}`);
    const response = await fetch(url);
    await response.json();
    loadedItems++;
    updateLoadingProgress();
  }

  await Promise.all(imagePromises);
  loadedItems = totalItems;
  updateLoadingProgress();
};

document.addEventListener('DOMContentLoaded', () => {
  console.debug(`[DOMContentLoaded] Event triggered.`);
  startTrackingResources();
});

// WIP: ---------------------------------------------------------------------------------
