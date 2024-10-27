# Loading Progress Component - Step-by-Step Guide

The **Loading Progress Component** provides a seamless way to inform users of the loading status of your webpage. It tracks both image loading and API requests, and it displays the progress in real-time with a smooth, visually engaging progress bar. This guide will walk you through how to set up, customise, and optimise this component for your project.

## Overview

The component is designed to:
- Track the progress of images and API calls.
- Smoothly update the progress bar in small increments.
- Gracefully hide the loading screen once all content is fully loaded.
- Allow for easy integration into your existing or new webpages.

### Key Concepts

1. **Smooth Progress Updates**: The progress bar doesn't jump abruptly from one value to another but increments gradually for a more polished user experience.

2. **Resource Tracking**: Tracks both images and API requests to ensure the loading screen only disappears when all resources are fully loaded.

3. **Customisable Delay**: You can adjust how quickly or slowly the progress bar moves by setting custom delays based on the percentage of loading completed.

---

## Step-by-Step Setup

### 1. **HTML Structure**

First, you need to have a basic structure in your HTML file. This includes a loading screen, a progress bar, and a percentage text element.

- **Loading Screen**: This will cover the screen while resources are being loaded.
- **Progress Bar**: A horizontal bar that visually reflects the percentage of resources loaded.
- **Loading Text**: A text display showing the percentage of loading completed.

Make sure your HTML has the necessary elements (e.g., a `div` for the loading screen and progress bar).

### 2. **CSS Styling**

You should style your loading screen to make it visually appealing. This includes setting a background for the screen, defining the size and colour of the progress bar, and adding transitions for smooth hiding once loading completes.

- **Loading Screen**: Ensure it covers the full viewport (`100%` width and height) and has a high `z-index` so that it sits above your page content.
- **Progress Bar**: You can use `width: 0%` initially, and then dynamically update the width to show loading progress.
- **Hiding the Loading Screen**: Once loading is complete, you can fade out or transition the loading screen using CSS opacity and transitions.

### 3. **JavaScript for Loading Tracking**

#### a. **Image Tracking**
The component will automatically find all images on the page and track their loading progress. It works by creating new `Image` objects and assigning the `src` of each image. Once the image is fully loaded, it updates the progress.

**Things to note:**
- The script will count all the `img` elements in your HTML and increment the loading count as each one loads.
- If you're dynamically adding images via JavaScript, ensure they are added before the loading tracking starts.

#### b. **API Call Tracking**
If your page makes API requests (e.g., fetching data from an external service), the component tracks these requests as well. For every API request (using `fetch`), the component will add it to the total resource count and wait for it to complete before updating the progress.

**Things to note:**
- You must specify your API endpoints to be tracked (e.g., fetching a JSON file or a database query).
- Make sure to handle cases where API calls might fail. The progress bar will still increment, but error handling should be in place for failed requests.

### 4. **Calculating and Updating Progress**

The core functionality of this component is to track the percentage of resources loaded and update the progress bar accordingly.

- **Tracking Items**: Every image or API request increases the count of total items that need to be loaded.
- **Progress Calculation**: The progress percentage is calculated by dividing the number of loaded items by the total number of items (images + APIs). This percentage is then reflected in both the progress bar's width and the displayed percentage text.

**Things to note:**
- Ensure the progress bar increments smoothly. To achieve this, small steps should be used to gradually increase the progress, especially for the last few percentages (e.g., from 90% to 100%).

### 5. **Customisation**

#### a. **Loading Speed and Delay**
You can customise how quickly the progress bar fills by adjusting the delay between progress updates. For example:
- **Slower Start**: You might want the progress bar to fill slowly for the first 50% and then speed up once most resources have been loaded.
- **Final Percentages**: Typically, the progress should slow down as it nears completion to give the user a smoother experience.

#### b. **Dynamic Content**
If your content is added dynamically (e.g., images or data are injected after the page has initially loaded), ensure that the component takes these into account.

- You can dynamically update the total resource count if more items are added after the initial tracking starts.
- You can also trigger additional loading updates when new resources (images or APIs) are added.

### 6. **Hiding the Loading Screen**

Once all resources are loaded and the progress reaches 100%, the loading screen should disappear gracefully. You can achieve this by:
- Gradually reducing the opacity of the loading screen to `0`.
- Setting the `z-index` to a negative value or removing the loading screen entirely from the DOM once it's no longer needed.

**Things to note:**
- Ensure the loading screen only hides when the progress is fully complete (i.e., 100%).
- Add a slight delay to the hiding process to ensure a smooth transition.

---

## Example Use Cases

- **Single-Page Websites**: For a website with a lot of static images or a heavy API reliance (e.g., portfolio websites), this component gives users feedback on the loading process.

- **Interactive Applications**: For web apps that depend on multiple API calls or data loading (e.g., dashboards), the component provides transparency on the loading process.

---

## Key Takeaways

1. **Progress Control**: Control over how and when the progress is updated provides flexibility and ensures the user feels informed during loading.
2. **Smooth Transitions**: The gradual updates and final transition out of the loading screen provide a polished, professional feel.
3. **Customisation**: You can adjust loading speed, resource tracking, and hiding behaviour to fit your specific use case.
