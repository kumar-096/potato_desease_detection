export function playNotificationSound(type = "info") {
  let src = "/sounds/info.mp3";

  if (type === "success") src = "/sounds/success.mp3";
  if (type === "warning") src = "/sounds/warning.mp3";

  const audio = new Audio(src);
  audio.volume = 0.5;
  audio.play().catch(() => {});
}
