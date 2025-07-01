document.addEventListener("DOMContentLoaded", () => {
  const videoFeed = document.getElementById("videofeed");
  let currentVideoIndex = 0;
  let isFetching = false;

  const videoCards = [];

const SEARCH_TERMS = [
  "video (1).mp4", "video (2).mp4", "video (3).mp4", "video (4).mp4", "video (5).mp4",
  "video (6).mp4", "video (7).mp4", "video (8).mp4", "video (9).mp4", "video (10).mp4",
  "video (11).mp4", "video (12).mp4", "video (13).mp4", "video (14).mp4", "video (15).mp4",
  "video (16).mp4", "video (17).mp4", "video (18).mp4", "video (19).mp4", "video (20).mp4",
  "video (21).mp4", "video (22).mp4", "video (23).mp4", "video (24).mp4", "video (25).mp4",
  "video (26).mp4", "video (27).mp4"
];

  function createVideoCard(fileName) {
    const videoCard = document.createElement("div");
    videoCard.classList.add("video-card");

    videoCard.innerHTML = `
      <video
        src="videos/${fileName}"
        controls
        playsinline
        preload="metadata"
      ></video>
    `;

    videoFeed.appendChild(videoCard);
    videoCards.push(videoCard);
    observer.observe(videoCard);
  }

  // --- Observer: One plays with sound, rest pause ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target.querySelector("video");

      if (!video) return;

      if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
        // Pause all other videos
        document.querySelectorAll("video").forEach(v => {
          if (v !== video) {
            v.pause();
          }
        });

        // Try playing with sound
        video.muted = false;
        const playPromise = video.play();

        if (playPromise !== undefined) {
          playPromise.catch(error => {
            // If autoplay fails due to browser policy, mute and retry
            video.muted = true;
            video.play();
          });
        }
      } else {
        video.pause();
      }
    });
  }, {
    threshold: 0.75,
    root: videoFeed
  });

  function fetchNextVideos() {
    if (isFetching || currentVideoIndex >= SEARCH_TERMS.length) return;

    isFetching = true;

    const end = Math.min(currentVideoIndex + 3, SEARCH_TERMS.length);
    for (let i = currentVideoIndex; i < end; i++) {
      createVideoCard(SEARCH_TERMS[i]);
    }

    currentVideoIndex = end;
    isFetching = false;
  }

  videoFeed.addEventListener("scroll", () => {
    if (videoFeed.scrollTop + videoFeed.clientHeight >= videoFeed.scrollHeight - 150) {
      fetchNextVideos();
    }
  });

  // Initial fetch
  fetchNextVideos();
});
