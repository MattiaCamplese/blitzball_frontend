const audio = new Audio("/music/theme.mp3");
audio.preload = "auto";
audio.loop = true;
audio.volume = 0.3;

export default audio;