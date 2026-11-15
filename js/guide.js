/* EquipTrack - Guide page: animate the equalizer while ambience audio plays */
document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("ambience");
  const eq = document.getElementById("eq");
  if (!audio || !eq) return;
  audio.volume = 0.4;
  audio.addEventListener("play", () => eq.classList.add("playing"));
  audio.addEventListener("pause", () => eq.classList.remove("playing"));
});
