
console.log(
  `%c🌍 Developed by ENKR - GitHub:\t\t https://github.com/enkr1`,
  `
      color: white;

      font-family: Trebuchet MS;
      // font-family: cursive;
      // font-family: "Gill Sans", sans-serif;
      // font-family: Georgia, serif;
      // font-family: "Open Sans", sans-serif;
      // font-family: "Consolas", monospace;

      font-size: 1.2em;
      // text-shadow: whitegrey 1px 1px;
      // background-color: white;

      // background-image: $theme-background;
      background-image: linear-gradient(0deg, #121212, #b1b1b4);

      border-top-left-radius: .8rem;
      border-bottom-right-radius: .8rem;

      padding: .4rem 1.2rem;
      margin: .4rem;
      `);

const log = (msg, data) => console.debug(`[DEBUG] ${msg}`, data);
const error = (msg, data) => console.error(`[ERROR] ${msg}`, data);

// const BRANCH = "design-v3";
const BRANCH = "master";
const ENDPOINT = `https://raw.githubusercontent.com/enkr1/platforms/${BRANCH}/_data`;
const PATHNAME = window.location.pathname;
const PARAMS = new URLSearchParams(window.location.search);
const SPOTIFY_CLIENT_ID = "b7b905e62970411380e521ca1dd7412f";
const SPOTIFY_CLIENT_SECRET = "ff64de64aab443a480059ea420331a23";
const SPOTIFY_REDIRECT_URI = "https://enkr1.github.io/platforms"; // Make sure this is registered in your Spotify app settings
const SPOTIFY_SCOPE = "user-read-currently-playing";
const SPOTIFY_AUTHORISE_URL = "https://accounts.spotify.com/authorize";
// const SPOTIFY_REDIRECT_URI = 'http://127.0.0.1:5500/platforms'; // Make sure this is registered in your Spotify app settings
const LIST_ICON_BUTTONS = [
  "facebook",
  "github",
  "instagram",
  "linkedin",
  "youtube",
];
const TYPE_ICON = 1;
const TYPE_BUTTON = 2;
const TYPES_PLATFORMS = [
  TYPE_ICON,
  TYPE_BUTTON,
];
const BLOG_ENDPOINT = "https://enkr1.github.io/blog/archives/";
const BLOG_DISPLAY_N = 8;

const readFile = async (file) => {
  try {
    const response = await fetch(file);
    // Check if the response was ok (status 200-299)
    if (!response.ok) throw new Error('Network response was not ok: ' + response.statusText);

    return await response.json();
  } catch (error) {
    console.error("There was a problem reading the file:", error);
  }
}

const docReady = (fn) => {
  // see if DOM is already available
  if (document.readyState === "complete" || document.readyState === "interactive") {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}
const generateEyeCandy = () => {
  let starSection = document.getElementById("star-section");
  if (!starSection) return;

  // REF: https://stackoverflow.com/a/1527820/13677125
  // REF: https://bobbyhadz.com/blog/javascript-get-random-float-in-range
  function getRandomInt(min, max, decimals = 2) {
    return (Math.random() * (max - min) + min).toFixed(decimals);
  }

  for (let i = 0; i < 333; i++) {
    let l = getRandomInt(0, 99);
    let a = getRandomInt(3, 33, 1.3);
    let ad = getRandomInt(.33, 18.88, 1);
    let o = getRandomInt(.1, .8);
    let s = getRandomInt(1, 3);
    // let s = getRandomInt(10, 30);
    let zIndex = Math.random() < 0.5 ? 1 : 3; // Randomize z-index to be either 1 or 3

    starSection.innerHTML += `
      <div
        class="star"
        style="
            left: ${l}%;
            --star-size: ${s}px;
            border-right: ${s}px solid transparent;
            border-left: ${s}px solid transparent;
            border-bottom: ${s * Math.sqrt(3)}px solid white;
            animation: flying ${a}s linear infinite;
            animation-delay: ${ad}s;
            opacity: ${o};
            z-index: ${zIndex};
            "
      >
      </div>`;
  }
}
const generateRolesDiv = (profile_obj) => `
<div class="role-container">
  ${profile_obj.roles.map(role => `<span class="role-single">${role}</span>`).join('')}
</div>
`;

// Beat. Code. Lift. Repeat. – The rhythm of innovation.
const generateQuoteDiv = (profile_obj) => `
<div class="quote-container">
  <span>
      "${profile_obj.bio}"
  </span>
</div>
`;

const generateSpotifyDiv = () => `
<div id="spotify-container" class="spotify-container">
  <h2 class="spotify-theme">Spotify</h2>
  <div id="track-info">
      <span>Loading...</span>
  </div>
</div>
`;

const appendButtons = async (type, list) => {
  let data = ``;
  for (let i = 0; i < list.length; i++) {
    let element = list[i];
    if (undefined == element.name || undefined == element.link) {
      error("Invalid json.");
      return data;
    }

    let platform = new Platform(element.name, element.className, element.link)
    data += await platform.append(type);
  }

  return data;
}

const appendPriorityFocuses = (profile_obj) => `
<div class="priority-focuses-container">
  <h2>Priority Focuses</h2>
  <div class="pf-list">
      ${profile_obj.priorityFocuses.map((focus, index) => `<div><p>${index + 1}. ${focus}</p></div>`).join('')}
  </div>
</div>
`;

// Generate a random string for the state parameter
const generateRandomString = (length) => {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

/**
 * Fetches the latest blog posts and appends them to a specified section.
 */
async function fetchAndDisplayLatestPosts() {
  try {
    // Fetch the blog HTML
    const response = await fetch(BLOG_ENDPOINT);
    if (!response.ok) throw new Error('Failed to fetch blog content');
    const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
    // log("doc", doc);

    // Select all article elements
    const topNArticles = Array.from(doc.querySelectorAll("article")).slice(0, BLOG_DISPLAY_N);
    // log("topNArticles", topNArticles);

    let aYear = doc.querySelector(".collection-header").textContent.trim();
    // Map over each article to generate HTML string
    let data = topNArticles.map(article => {
      const time = article.querySelector(".post-meta time").textContent.trim();
      const title = article.querySelector(".post-title span").textContent.trim();
      const link = article.querySelector(".post-title a").href;
      return `<div class="article-link-container"><a href="${link}" target="_blank"><b>${aYear}-${time}</b>: ${title}</a></div>`;
    }).join("");
    log("data", data);

    return `
    <div class="blog-articles-container">
      <div class="ba-title-section">
        <h2>Recent Blog Posts<h2>
      </div>
      <div class="list-articles-container">
        ${data}
      </div>
    </div>
    `;
  } catch (error) {
    console.error('Error fetching and displaying blog posts:', error);
    return null;
  }
}

// WIP: ================================================ Spotify ================================================

const authoriseSpotifyAccount = () => {
  log("spotify debug - before")
  if (
    PATHNAME === "/platforms/spotify_callback"
    || PATHNAME === "/platforms/spotify_callback.html"
  ) {
    log("callback-ing")
    // This function is called when the page loads
    var state = generateRandomString(16); // Generate a random state value for CSRF protection

    // Construct the URL for Spotify's authorization page
    var url = SPOTIFY_AUTHORISE_URL;
    url += '?response_type=code';
    url += '&client_id=' + encodeURIComponent(SPOTIFY_CLIENT_ID);
    url += '&scope=' + encodeURIComponent(SPOTIFY_SCOPE);
    url += '&redirect_uri=' + encodeURIComponent(SPOTIFY_REDIRECT_URI);
    url += '&state=' + encodeURIComponent(state);

    log("spotify auth url", url);

    window.location.href = url; // Redirect to Spotify's authorisation page
  }
}

const generateSpotifyContainer = () => {
  const code = PARAMS.get("code");
  let trackInfo = document.getElementById("track-info");
  const loginMsg = `<a href="spotify_callback">Authenticate with Spotify to view his current listening activity.</a>`;

  // if (!trackInfo) return;
  if (!code) {
    // error("Error gettin code");
    if (trackInfo) trackInfo.innerHTML = loginMsg;
    return;
  } else {
    fetchAccessToken(code, accessToken => {
      if (!accessToken) {
        error("Error gettin accessToken");
        trackInfo.innerHTML = loginMsg;
        return;
      }

      fetchCurrentlyPlaying(accessToken);
    });
  }

  function fetchAccessToken(code, callback) {
    const credentials = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);

    // Prepare the form data
    let formData = new URLSearchParams();
    formData.append('grant_type', 'authorization_code');
    formData.append('code', code);
    formData.append('redirect_uri', SPOTIFY_REDIRECT_URI);

    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`
      },
      body: formData
    })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        console.log('Access token received:', data.access_token);
        callback(data.access_token); // Pass the token to the callback function
      })
      .catch(error => {
        console.error('Error exchanging code for token:', error);
        callback(null); // Pass null to the callback to indicate an error
      });
  }

  function fetchCurrentlyPlaying(accessToken) {
    log("accessToken", accessToken);

    fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
      .then(async response => {
        log("response", response)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        log("check1", response)
        // log("check2", await response.json())
        log("check3", response.status)

        if (response.status === 204) {
          // throw new Error('No content'); // No currently playing track
          log("no content");
          return null;
        }
        return response.json();
      })
      .then(data => displayTrackInfo(data))
      .catch(error => error('Error fetching currently playing:', error));
  }

  // Display the currently playing track info
  function displayTrackInfo(data) {
    log(">>> data", data);
    let trackInfoDiv = document.getElementById('track-info');

    if (!data) {
      trackInfoDiv.innerHTML = `<p class="nicp nicp-1">Nothing is currently playing.<p>`;
      return;
    }

    log(">>> Rendering track info", {
      item: data.item
    });

    if (!trackInfoDiv) return;

    let track = data.item;
    if (!data || !track) {
      trackInfoDiv.innerText = `<p class="nicp nicp-2">Nothing is currently playing.<p>`;
      return;
    }

    log("track", track);

    let trackName = track.name;
    let artists = track.artists.map(artist => artist.name).join(', ');
    // trackInfoDiv.innerHTML = `Now Playing: ${trackName} by ${artists}`;
    trackInfoDiv.innerHTML = `

  <div class="spotify-curr-playing-container">
      <p>Currently Playing</p>
      <a href="${track.external_urls.spotify}" target="_blank">
          <img src="${track.album.images[0].url}" alt="">
          <p class="track-name">${trackName}</p>
          <p class="track-artists">${artists}</p>
      </a>
      <!-- <div class="audio-preview">
          <audio controls>
              <source src="${track.preview_url}" type="audio/mpeg">
              Your browser does not support the audio element.
          </audio>
      </div> -->
  </div>

  `;
  }
}

log("PATHNAME", PATHNAME);

// NOTE: ================================ MAIN ================================
docReady(async () => {
  // if (
  //     PATHNAME !== "/platforms"
  //     || PATHNAME !== "/platforms/index.html"
  // ) return;

  const platform_obj = await readFile(`${ENDPOINT}/platform_obj.json`);
  const profile_obj = await readFile(`${ENDPOINT}/profile.json`);

  document.body.innerHTML += `
  <div class="floating-social-media-container" id="floating-social-media-container">
      ${await appendButtons(TYPE_ICON, platform_obj.listIcons)}
  </div>
  `;

  let wipMsg = "hey, gorgeous!";
  let data = "";

  data += `<div id="profile-section">`;

  // data += `<div class="fullname-container">${profile_obj.nickname}</div>`;
  data += `<div class="logo-container"><img src="assets/images/enkr.svg"></div>`;

  data += `
  <div class="profile-image-container">
      <a href="#" onclick='(function(){ alert("${wipMsg}"); })();'">
          <img src="${ENDPOINT}/images/profile.jpeg" alt="Profile">
      </a>
  </div>
  `;

  data += `
  <div class="fullname-container">
      <p>${profile_obj.firstname} <span class="n-bold">${profile_obj.lastname}</span></p>
  </div>
  `;

  data += generateRolesDiv(profile_obj);
  // data += generateQuoteDiv(profile_obj);
  //     data += `
  //     <div class="globe-view-counter-container">
  //         <script type="text/javascript" src="//rf.revolvermaps.com/0/0/8.js?i=5zfrl0bzi0j&amp;m=0&amp;c=ff0000&amp;cr1=ffffff&amp;f=arial&amp;l=33" defer></script>
  //     </div>
  //
  //     `;

  data += `</div>`;

  data += `<div id="platform-section">`;
  data += await appendButtons(TYPE_BUTTON, platform_obj.listButtons);
  // data += `<hr>`;
  // data += appendPriorityFocuses(profile_obj);
  data += `<hr>`;
  data += await fetchAndDisplayLatestPosts();;

  // data += `
  // <div class="news-container">
  //     <h1>News</h1>
  //     <p>Coming Soon ...</p>
  // </div>
  // `;

  // data += generateSpotifyDiv();

  let profileSection = document.getElementById("platform-page");
  if (profileSection) profileSection.innerHTML = `${data}</div>`; // Replace, directly to replace the loading indicator

  authoriseSpotifyAccount();
  generateSpotifyContainer();
  generateEyeCandy();

  // Initialise old scroll position
  let lastScrollY = 0;
  // Get the floating social media container element by ID
  const floatingSocialMediaContainer = document.getElementById("floating-social-media-container");
  // Function to handle scroll events
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const atTop = currentScrollY === 0; // Check if the scroll is at the top of the page
    // const scrollingDown = lastScrollY < currentScrollY && Math.abs(lastScrollY - currentScrollY) > 5; // Determine if scrolling down and with a significant delta

    // Always apply 'reduce-opacity' class if not at the top of the page
    floatingSocialMediaContainer.classList.toggle('reduce-opacity', !atTop);

    // Update last scroll position
    lastScrollY = currentScrollY;
  }

  // Add event listener for scroll events
  window.addEventListener("scroll", handleScroll);
});


class Platform {
  constructor(name, className, link) {
    this.name = name;
    this.className = className;
    this.link = link;
  }

  async append(type) {
    const imageUrl = `assets/images/${this.className}-coloured.svg`;
    // console.log("> this", this.className)

    if (type === TYPE_ICON) {
      try {
        const response = await fetch(imageUrl);
        if (response.ok) { // The image exists, display it
          // console.log(`${imageUrl} = response`, response)
          return `
                  <a href="${this.link}" target="_blank" class="a-${this.className}">
                      <img src="${imageUrl}" alt="Social Media" class="img-${this.className}">
                  </a>
                  `
        }
      } catch (error) {
        console.error(`Error fetching image: ${imageUrl}`, error);
      }
    } else if (type === TYPE_BUTTON) {
      return `
        <div class="single-button single-button-${this.className}">
            <a href="${this.link}" target="_blank" class="">
                <span>${this.name}</span>
            </a>
        </div>
        `;
    } else {
      error("Unexpected type", type);
    }
  }
}

class Achievement {
  constructor(title, list) {
    this.title = title;
    this.list = list;
  }

  append() {
    return `
          <div class="al-container">
              <h1 class="achievement-title collapsible">${this.title}</h1>
              <div class="list-container">
                  ${this.loop_al()}
              </div>
          </div>
      `;
  }

  loop_al() {
    let alList = [];
    this.list.forEach(item => {
      let al = new AchievementList(item.category, item.list)
      alList += al.append()
    });
    return alList;
  }
}

class AchievementList {
  constructor(category, list) {
    this.category = category;
    this.list = list;
  }

  append() {
    return `
      <div class="category-container" data-category="${this.category}">
          <h2>${this.category}</h2>
          <div class="title-list-container">${this.set_title_list()}</div>
      </div>
      `;
  }

  set_title_list() {
    let titleDoms = "";
    this.list.forEach(title => {
      titleDoms += `<p class="al-title">${title}</p>`
    })
    return titleDoms;
  }
}
