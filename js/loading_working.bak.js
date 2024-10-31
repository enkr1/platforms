let loadedItems = 0;
let totalItems = 0;
let currentPercent = 0;

const apiFetches = [
  `${ENDPOINT_DATA}/platform_obj.json`,
  `${ENDPOINT_DATA}/profile.json`,
  // Add more API URLs here
];

const updateLoadingProgressSmoothly = (targetPercent, delay = 50) => {
  // Get references to both the circle and the loading text
  const circle = document.getElementById("progress-circle-bottom");
  const loadingText = document.getElementById("loading-text");
  const totalLength = circle.getTotalLength();
  circle.style.strokeDasharray = `${totalLength}`; // Set the length of dashes
  circle.style.strokeDashoffset = totalLength; // Start with an empty circle
  circle.style.stroke = `#fff`; // Start with an empty circle

  targetPercent = Math.min(targetPercent, 100); // Cap at 100%
  let currentStep = currentPercent; // Start from the current progress to the target

  log(`Starting smooth progress update to ${targetPercent}%`);

  // Use a fixed increment approach to get predictable behavior similar to the standalone script
  const interval = setInterval(() => {
    if (currentStep < targetPercent) {
      currentStep += 1; // Increment by 1% each time for consistent filling
      currentPercent = Math.min(currentStep, targetPercent); // Update currentPercent to reflect currentStep progress

      // Update the circle progress to match the current percentage
      const dashOffset = totalLength * (1 - currentPercent / 100);
      circle.style.strokeDashoffset = dashOffset;

      // Update the loading text
      loadingText.innerText = `${Math.floor(currentPercent)}%`;
    } else {
      clearInterval(interval);

      // Only hide the loading screen once it reaches 100%
      if (currentPercent >= 100) {
        setTimeout(() => {
          document.getElementById("overall-body-wrapper").style.display = "block";
          document.getElementById("svg-progress-element").style.opacity = "0";
          document.getElementById("loading-text").style.opacity = "0";
          document.getElementById("loading-screen").style.opacity = "0";
          document.getElementById("loading-screen").style.zIndex = "-999";
        }, 300);
      }
    }
  }, delay);
};


// Function to update loading progress
const updateLoadingProgress = () => {
  const percent = (loadedItems / totalItems) * 100;

  // Slow down the earlier progress increments
  const delay = (percent < 50) ?
    330 :
    ((percent < 80) ? 130 : 33); // Adjust delay based on current progress
  log(`${loadedItems}/${totalItems} - Loading progress: ${percent}%, delay: ${delay}ms`);
  updateLoadingProgressSmoothly(percent, delay);
};


// Dynamically fetch all images from the DOM
const getAllImages = () => {
  const images = [...document.querySelectorAll('img')].map(img => img.src);
  totalItems += images.length; // Increment totalItems dynamically
  return images;
};

// Track image loading with promises
const trackImageLoading = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = img.onerror = () => {
      loadedItems++;
      log(`${loadedItems}/${totalItems} - Image loaded: ${src}`);

      updateLoadingProgress();
      resolve();
    };
  });
};

// Track API loading and fetch
const trackedFetch = async (url) => {
  totalItems++; // Increment totalItems dynamically
  const apiPromise = fetch(url);
  await apiPromise;
  loadedItems++;
  log(`[DEBUG] ${loadedItems}/${totalItems} - API loaded: ${url}`);
  updateLoadingProgress();
  return apiPromise;
};

// Start tracking resources (images and API calls)
const startTrackingResources = async () => {
  const images = getAllImages(); // Automatically fetch all images from the DOM

  log(`[DEBUG] Total initial resources to load: ${totalItems} (Images: ${images.length}, APIs: ${apiFetches.length})`);

  const imagePromises = images.map(trackImageLoading);
  const fetchPromises = apiFetches.map(trackedFetch);

  await Promise.all([...imagePromises, ...fetchPromises]);
  updateLoadingProgress(); // Final call to ensure progress reaches 100%
};

// Start tracking resources when DOM is ready
document.addEventListener('DOMContentLoaded', startTrackingResources);
