chrome.storage.local.get(["timeData"], (data) => {
  const timeData = data.timeData || {};
  const list = document.getElementById("timeList");
  list.innerHTML = "";

  for (const site in timeData) {
    const li = document.createElement("li");
    li.textContent = `${site}: ${(timeData[site] / 60).toFixed(1)} min`;
    list.appendChild(li);
  }
});

document.getElementById("dashboardBtn").addEventListener("click", () => {
  chrome.tabs.create({ url: "http://localhost:5000/dashboard" }); // backend dashboard
});
