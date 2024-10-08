document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("userAgent").value = navigator.userAgent;
});

function sendMessage(action, data) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      console.error("No active tabs found.");
      return;
    }

    chrome.tabs.sendMessage(tabs[0].id, { action, ...data });
  });
}

document
  .getElementById("linkedinTargetStartButton")
  .addEventListener("click", () => {
    const userUrn = document.getElementById("userUrn").value.trim();
    if (userUrn) {
      alert(
        "데이터 수집을 시작합니다! 해당 프로세스는 러닝하고 다른 업무를 할 수 있습니다."
      );
      sendMessage("startLinkedinTargetScraping", { userUrn });
    } else {
      alert("Please enter valid userUrn fields.");
    }
  });

document.getElementById("linkedinStartButton").addEventListener("click", () => {
  const count = Number(document.getElementById("pageCount").value);
  const sleep = Number(document.getElementById("sleepCount").value);
  if (!isNaN(count) && count > 0 && !isNaN(sleep) && sleep > 0) {
    alert(
      "데이터 수집을 시작합니다. 한 번 시작하면 강제 새로 고침을 해야만 멈출 수 있습니다."
    );
    sendMessage("startLinkedinScraping", { count, sleep });
  } else {
    alert("Please enter valid numbers for both fields.");
  }
});

document.getElementById("rememberStartButton").addEventListener("click", () => {
  const token = document.getElementById("token").value.trim();
  const userAgent = document.getElementById("userAgent").value.trim();
  const totalPageCount = Number(
    document.getElementById("totalPageCount").value
  );
  if (token && userAgent && !isNaN(totalPageCount) && totalPageCount > 0) {
    alert(
      "데이터 수집을 시작합니다. 한 번 시작하면 강제 새로 고침을 해야만 멈출 수 있습니다."
    );
    sendMessage("startRememberScraping", { token, userAgent, totalPageCount });
  } else {
    alert("Please enter valid numbers for 전체 페이지 수 fields.");
  }
});

document
  .getElementById("googleUrlParsingButton")
  .addEventListener("click", () => {
    alert(
      "모든 검색 결과를 열어야 제대로 URL 값을 가져올 수 있습니다. 그리고 한 번 시작하면 강제 새로 고침을 해야만 멈출 수 있습니다!"
    );
    sendMessage("googleUrlScraping", {});
  });

document.getElementById("howtoButton").addEventListener("click", () => {
  window.open(
    "https://www.notion.so/searchright/How-To-Use-SearcHRight-Chrome-Extensions-26572506982e4a49b36b7839ff0b4b7a?pvs=4",
    "_blank"
  );
});

document.getElementById("adminButton").addEventListener("click", () => {
  window.open("https://searchright.net/admin", "_blank");
});
