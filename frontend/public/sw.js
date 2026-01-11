self.addEventListener("push", function (event) {
  const data = event.data?.json() || {
    title: "Crop Health AI",
    body: "New notification",
  };

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/logo192.png",
  });
});
