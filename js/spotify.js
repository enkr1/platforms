
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

// authoriseSpotifyAccount();
// generateSpotifyContainer();
