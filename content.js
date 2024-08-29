const VERSION = "24.07.27";

function logVersion() {
  console.log(`${VERSION} 버전이 실행되고 있습니다.`);
  console.log(
    `
    %c███████╗███████╗ █████╗ ██████╗  ██████╗██╗  ██╗██████╗ ██╗ ██████╗ ██╗  ██╗████████╗
    %c██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝██║  ██║██╔══██╗██║██╔════╝ ██║  ██║╚══██╔══╝
    %c███████╗█████╗  ███████║██████╔╝██║     ███████║██████╔╝██║██║  ███╗███████║   ██║   
    %c╚════██║██╔══╝  ██╔══██║██╔══██╗██║     ██╔══██║██╔══██╗██║██║   ██║██╔══██║   ██║   
    %c███████║███████╗██║  ██║██║  ██║╚██████╗██║  ██║██║  ██║██║╚██████╔╝██║  ██║   ██║   
    %c╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   
  `,
    "color:#22577A",
    "color:#38A3A5",
    "color:#57CC99",
    "color:#80ED99",
    "color:#99FFED",
    "color:#FFFFFF"
  );
}

/**
 * Formats the current date into yyyy-mm-dd format.
 * @returns {string} The formatted date string.
 */
function getFormattedDate() {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Converts an array of objects to JSON format.
 * @param {Array<Object>} array - The array of objects to convert.
 * @returns {string} The JSON formatted string.
 */
function arrayToJSON(array) {
  return JSON.stringify(array, null, 2);
}

/**
 * Triggers a download of the given JSON data.
 * @param {string} json - The JSON formatted string.
 * @param {string} filename - The name of the file to download.
 */
function downloadJSON(json, filename) {
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Delays the execution for a specified amount of milliseconds.
 * @param {number} ms - The number of milliseconds to delay.
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 */
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ==================================================================== //
// 링크드인 리쿠르트 라이트 데이터 파싱, 전후처리
// ==================================================================== //

/**
 * Parses a position period from LinkedIn.
 * @param {string} period - The period string in the format "MMM YYYY – MMM YYYY", "YYYY – YYYY", or "MMM YYYY – Present".
 * @returns {Object} The parsed period object with start and optionally end dates, or null if parsing fails.
 */
function parsePositionPeriod(period) {
  try {
    const [startStr, endStr] = period.split(" – ");
    let startDate, endDate;

    // Handle cases where only the year is provided
    if (startStr.length === 4) {
      startDate = new Date(Date.parse(`Jan ${startStr} 1`));
    } else {
      startDate = new Date(Date.parse(`${startStr} 1`));
    }

    if (endStr === "Present") {
      endDate = null;
    } else if (endStr.length === 4) {
      endDate = new Date(Date.parse(`Dec ${endStr} 1`));
    } else {
      endDate = new Date(Date.parse(`${endStr} 1`));
    }

    if (isNaN(startDate) || (endDate !== null && isNaN(endDate)))
      throw new Error("Invalid date");

    const periodObj = {
      start: {
        month: startDate.getMonth() + 1,
        year: startDate.getFullYear(),
      },
    };

    if (endDate) {
      periodObj.end = {
        month: endDate.getMonth() + 1,
        year: endDate.getFullYear(),
      };
    }

    return periodObj;
  } catch (error) {
    console.error("Error parsing period:", period, error);
    return null;
  }
}

/**
 * Merges overlapping periods.
 * @param {Array<Object>} periods - The array of period objects.
 * @returns {Array<Object>} The merged array of period objects.
 */
function mergePeriods(periods) {
  // Filter out invalid periods
  periods = periods.filter((period) => period !== null && period.start);
  periods.sort(
    (a, b) =>
      new Date(a.start.year, a.start.month - 1) -
      new Date(b.start.year, b.start.month - 1)
  );

  const merged = [];
  let current = periods[0];

  for (let i = 1; i < periods.length; i++) {
    const period = periods[i];
    const currentEndDate = current.end
      ? new Date(current.end.year, current.end.month - 1)
      : new Date();
    const periodStartDate = new Date(period.start.year, period.start.month - 1);

    if (currentEndDate >= periodStartDate) {
      const periodEndDate = period.end
        ? new Date(period.end.year, period.end.month - 1)
        : new Date();
      if (currentEndDate < periodEndDate) {
        current.end = period.end;
      }
    } else {
      merged.push(current);
      current = period;
    }
  }

  merged.push(current);
  return merged;
}

/**
 * Calculates the total duration from an array of periods.
 * @param {Array<Object>} periods - The array of period objects.
 * @returns {Object} The total duration in years and months.
 */
function calculateTotalDuration(periods) {
  let totalMonths = 0;

  periods.forEach((period) => {
    const startDate = new Date(period.start.year, period.start.month - 1);
    const endDate = period.end
      ? new Date(period.end.year, period.end.month - 1)
      : new Date();
    const months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());
    totalMonths += months + 1; // Including the start month
  });

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return { years, months };
}

/**
 * Navigates to the next page by clicking the active pagination link.
 * @returns {Promise<void>} A promise that resolves when the navigation action is performed.
 */
async function navigateToNextPage() {
  const paginationLinks = document.querySelectorAll(
    ".skyline-pagination-link--active"
  );
  if (paginationLinks.length > 0) {
    paginationLinks[paginationLinks.length - 1].click();
  }
}

/**
 * Parses data from the current LinkedIn profile page.
 * @returns {Promise<Object>} A promise that resolves to an object containing the parsed data.
 */
async function dataParsing() {
  // 클릭해야 하는 것들 미리 클릭하기
  document.querySelector("#line-clamp-show-more-button")?.click(); // 서머리
  await delay(500);

  const skillButton = document.querySelectorAll(
    "button[aria-label][data-test-expandable-button]"
  )[1];
  skillButton?.click(); // skills
  await delay(500);

  const positionButton = document.querySelector(
    'button[aria-label="Show more positions"][data-test-expandable-button]'
  );
  positionButton?.click(); // positions
  await delay(500);

  // 헤드라인
  const headlineElement = document.querySelector(
    "span[data-test-row-lockup-headline]"
  );
  const headline = headlineElement ? headlineElement.innerText : null;

  // 서머리
  const summaryElement = document.querySelector(
    "section[data-test-profile-summary-card] span.lt-line-clamp__raw-line"
  );
  const summary = summaryElement ? summaryElement.innerText : null;

  // 이름
  const fullNameElement = document.querySelector(
    "div.artdeco-entity-lockup__title"
  );
  const fullName = fullNameElement
    ? fullNameElement.innerText.split(" ")
    : ["", ""];
  const firstName = fullName[0];
  const lastName = fullName[1];

  // 프로필
  const photoUrlElement = document.querySelector(
    "span.lockup__image-container > img"
  );
  const photoUrl = photoUrlElement ? photoUrlElement.src : null;

  // 섹션 노드 필터링
  const filteredNodes = Array.from(
    document.querySelectorAll("div.expandable-list.expandable-stepper")
  ).filter((node) => node.classList.length > 2);

  // 회사
  const positionsNode = Array.from(filteredNodes).find((node) =>
    node.querySelector("h2[data-test-expandable-list-title]")
  );
  let positions = [];
  if (positionsNode) {
    positionsNode.querySelectorAll("li").forEach((li) => {
      // ======================================================= //
      // 아래는 하나의 회사에서 여러 색션으로 나눠서 입력한 것임
      // 이 경우 그냥 한 회사를 여러개 회사 처럼 처리하는게 가장 빠를 수 있음
      // div[data-test-position-list] 하위 div 로 다 묶여 있음 (아래로)
      // ======================================================= //
      const companySections = li.querySelectorAll(
        "div.grouped-position-entity__right-content"
      );

      if (companySections.length >= 1) {
        const companyName = li
          .querySelector("strong.grouped-position-entity__company-name")
          ?.innerText.trim();
        const companyLogo = li
          .querySelector("img.logo-container__img")
          .getAttribute("src")
          ?.trim();

        companySections.forEach((div) => {
          const startEndDate = div
            .querySelector("span[data-test-grouped-position-entity-date-range]")
            ?.innerText.trim();
          const tempObj = {
            companyName: companyName,
            title: div
              .querySelector("dd[data-test-grouped-position-entity-title]")
              ?.innerText.trim(),
            companyLocation: div
              .querySelector("dd[data-test-grouped-position-entity-location]")
              ?.innerText.trim(),
            description: div
              .querySelector(
                "dd[data-test-grouped-position-entity-description]"
              )
              ?.innerText.trim(),
            startEndDate: startEndDate
              ? parsePositionPeriod(startEndDate)
              : startEndDate,
            companyLogo: companyLogo,
          };
          positions.push(tempObj);
        });
      }
      // ======================================================= //
      // 하나의 회사에 하나의 정보만 넣은 경우
      // ======================================================= //
      else {
        const startEndDate = li
          .querySelector("span.background-entity__date-range")
          ?.innerText.trim();

        let companyName = li
          .querySelector("a.position-item__company-link")
          ?.innerText.trim();

        // official company 가 아닌 경우, 위 값이 없어서 아래로 후처리 필요
        companyName = companyName
          ? companyName
          : li
              .querySelector(
                "dd.background-entity__summary-definition--subtitle"
              )
              ?.innerText.split("·")[0]
              .trim();

        const tempObj = {
          companyName: companyName,
          title: li
            .querySelector("a.position-item__position-title-link")
            ?.innerText.trim(),
          companyLocation: li
            .querySelector("dd.background-entity__summary-definition--location")
            ?.innerText.trim(),
          startEndDate: startEndDate
            ? parsePositionPeriod(startEndDate)
            : startEndDate,
          description: li
            .querySelector(
              "dd.background-entity__summary-definition--description"
            )
            ?.innerText.trim(),
          companyLogo: li
            .querySelector("img.logo-container__img")
            .getAttribute("src")
            ?.trim(),
        };
        positions.push(tempObj);
      }
    });
  }

  // 학력
  const educationsNode = Array.from(filteredNodes).find((node) =>
    node.hasAttribute("data-test-education-card")
  );
  let educations = [];
  if (educationsNode) {
    educationsNode.querySelectorAll("li").forEach((li) => {
      const tempObj = {
        degreeName: li
          .querySelector("span[data-test-education-entity-degree-name]")
          ?.innerText.trim(),
        fieldOfStudy: li
          .querySelector("span[data-test-education-entity-field-of-study]")
          ?.innerText.trim(),
        schoolName: li
          .querySelector("h3.background-entity__summary-definition--title")
          ?.innerText.trim(),
        startEndDate: li
          .querySelector(
            "dd.background-entity__summary-definition--date-duration"
          )
          ?.innerText.trim(),
      };
      educations.push(tempObj);
    });
  }

  // 스킬
  const skillsNode = Array.from(filteredNodes).find((node) =>
    node.hasAttribute("data-live-test-profile-skills-card")
  );
  let skills = [];
  if (skillsNode) {
    skillsNode.querySelectorAll("li").forEach((li) => {
      const skillElement = li.querySelector("dt");
      if (skillElement) skills.push(skillElement.innerText);
    });
  }

  // 링크드인 프로필
  const linkedinUrlElement = document.querySelector(
    "span[data-test-personal-info-profile-link-text]"
  );
  const linkedinUrl = linkedinUrlElement ? linkedinUrlElement.innerText : null;

  // 그 외 웹사이트
  const websiteNodes = document.querySelectorAll(
    "a.personal-info__link--website"
  );
  const website = Array.from(websiteNodes).map((node) => node.innerText);

  // 총 근무 기간 계산
  const mergedPositions = mergePeriods(
    positions.map((pos) => pos.startEndDate)
  );
  const totalDuration = calculateTotalDuration(mergedPositions);

  return {
    headline,
    summary,
    firstName,
    lastName,
    photoUrl,
    skills,
    educations,
    positions,
    totalDuration,
    linkedinUrl,
    website,
  };
}

// ==================================================================== //
// 리멤버 데이터 파싱, 전후처리
// ==================================================================== //

/**
 * Parses a date string in the format "YYYY-MM-DD" or null.
 * @param {string} dateStr - The date string to parse.
 * @returns {Object} The parsed date object with month and year.
 */
function parseDateString(dateStr) {
  if (!dateStr) return null;
  const [year, month] = dateStr.split("-");
  return {
    year: parseInt(year, 10),
    month: parseInt(month, 10),
  };
}

/**
 * Converts career periods from the provided data to the required format.
 * @param {Array<Object>} careers - The array of career objects.
 * @returns {Array<Object>} The array of period objects.
 */
function convertCareerPeriods(careers) {
  return careers.map((career) => {
    const start = parseDateString(career.joined_date);
    const end = career.present ? null : parseDateString(career.left_date);
    return { start, end };
  });
}

/**
 * Collects profile IDs from the current Remember search result page.
 * @param {Set<string>} profileIds - The set to store collected profile IDs.
 */
function collectProfileIds(profileIds) {
  document
    .querySelector("div[name=search-result-container]")
    .querySelectorAll("a")
    .forEach((aTag) => {
      const tempLinks = aTag.href.split("/");
      profileIds.add(tempLinks[tempLinks.length - 1].split("?")[0]);
    });
}

/**
 * Navigates to a specific page in the Remember search results.
 * @param {number} pageNumber - The page number to navigate to.
 */
function goToPage(pageNumber) {
  // 10페이지 단위일 때 '다음 페이지로 이동' 버튼 클릭
  if (pageNumber > 1 && pageNumber % 10 == 1) {
    document.querySelector('button[aria-label="다음 페이지로 이동"]').click();
    return;
  }
  const pageButton = document
    .querySelector(`button[aria-label="페이지 ${pageNumber}"]`)
    .click();
}

/**
 * Formats profile data for use with the Remember API.
 * @param {string} profileId - The profile ID.
 * @param {Object} data - The raw data from the API.
 * @returns {Object} The formatted profile data.
 */
function formattedData(profileId, data) {
  const profileData = data.data;
  const nameParts = profileData.name.split("OO");

  // 경력 데이터 전후 처리
  const positions = profileData.careers.map((career) => {
    return {
      companyName: career.company,
      title: career.position,
      startEndDate: {
        start: parseDateString(career.joined_date),
        end: career.present ? null : parseDateString(career.left_date),
      },
      companyLocation: career.address_level1 + " " + career.address_level2,
      description: career.description,
      companyLogo: null,
      //  아래는 리멤버만 가지고 있는 데이터
      company_tier_rank: career.company_tier_rank || "ZZ",
      industry: career.industry || {},
    };
  });

  // 교육 데이터 전후 처리
  const educations = profileData.academic_histories.map((edu) => {
    return {
      degreeName: edu.degree,
      fieldOfStudy: edu.major,
      schoolName: edu.school,
      startEndDate: edu.joined_date + " ~ " + edu.left_date,
    };
  });

  // 총 연차 계산하기
  const careerPeriods = convertCareerPeriods(profileData.careers);
  const mergedPeriods = mergePeriods(careerPeriods);
  const totalDuration = calculateTotalDuration(mergedPeriods);

  return {
    headline: profileData.main_career.position,
    summary: profileData.introduction,
    firstName: null,
    lastName: nameParts[0],
    photoUrl: profileData.profile_image_url
      ? profileData.profile_image_url.url
      : null,
    skills: profileData.skills.map((skill) => skill.skill),
    educations: educations,
    positions: positions,
    totalDuration: totalDuration,
    linkedinUrl: `https://career.rememberapp.co.kr/profiles/${profileId}`,
    website: profileData.appended_info
      .filter((info) => info.category === "url")
      .map((info) => info.value),

    // 아래는 리멤버만 가지고 있는 데이터
    job_seeking_status: profileData.job_seeking_status,
    created_at: profileData.created_at,
    updated_at: profileData.updated_at,
    user_updated_at: profileData.user_updated_at,
    code: profileData.code,
    desired_job_offer_conditions: profileData.desired_job_offer_conditions,
  };
}

/**
 * Fetches profile data from the Remember API.
 * @param {string} token - The API token.
 * @param {string} ua - The user agent string.
 * @param {string} profileId - The profile ID.
 * @returns {Promise<Object>} A promise that resolves to the profile data.
 */
async function fetchRememberApi(token, ua, profileId) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "ko",
      authorization: `Token token=${token}`,
      origin: "https://career.rememberapp.co.kr",
      "sec-ch-ua":
        '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent": ua,
    },
  };

  try {
    const response = await fetch(
      `https://career-api.rememberapp.co.kr/open_profiles/${profileId}`,
      options
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

// ==================================================================== //
// 실제 가동되는 크롬 익스텐션 이벤트 정의
// ==================================================================== //

/**
 * Starts the LinkedIn scraping process.
 * @param {number} scrapingCount - The number of profiles to scrape.
 * @param {number} sleepCount - The delay between scrapes in milliseconds.
 */
function scrapeLinkedInData(scrapingCount, sleepCount) {
  let cnt = 1;
  let errCnt = 0;
  const users = [];

  async function scrapePage() {
    try {
      // 에러 카운트가 올라가면 같은 페이지,
      if (errCnt >= 2) {
        await navigateToNextPage();
        errCnt = 0;
      } else {
        const nameElement = document.querySelector(
          "span[data-test-row-lockup-full-name]"
        );
        if (nameElement && nameElement.innerText !== "LinkedIn Member") {
          const userInfo = await dataParsing();
          if (userInfo) users.push(userInfo);
        }
        await navigateToNextPage();
        errCnt = 0;
      }
    } catch (error) {
      errCnt++;
      console.error("Error occurred:", error);
    } finally {
      await delay(sleepCount);
      console.log(
        `${cnt} 번째 데이터 수집 완료 (${scrapingCount} 개 남음) ... ${sleepCount}ms 동안 sleep ...`
      );
    }

    cnt++;
    scrapingCount--;
    if (scrapingCount > 0) {
      await scrapePage();
    } else {
      const filteredUsers = users.filter((user) => user.linkedinUrl);
      const json = arrayToJSON(filteredUsers);
      const formattedDate = getFormattedDate();
      const fileName = `[${formattedDate}]LinkedinUsers.json`;
      downloadJSON(json, fileName);
    }
  }

  scrapePage();
}

/**
 * Starts the Remember scraping process.
 * @param {string} token - The API token.
 * @param {string} ua - The user agent string.
 * @param {number} scrapingCount - The number of pages to scrape.
 */
async function scrapeRememberData(token, ua, scrapingCount) {
  const endPageNumber = scrapingCount;
  const profileIds = new Set();

  // 모든 페이지를 순회하며 프로필 ID를 수집하는 함수
  async function collectAllProfileIds(endPageNumber) {
    for (let i = 1; i <= endPageNumber; i++) {
      goToPage(i);
      await delay(2000);
      collectProfileIds(profileIds);
    }
  }

  // 시작 페이지는 1페이지로 설정하고 수집 시작
  await collectAllProfileIds(endPageNumber);
  const users = [];

  for (const profileId of profileIds) {
    try {
      const data = await fetchRememberApi(token, ua, profileId);
      if (data) {
        const userInfo = formattedData(profileId, data);
        users.push(userInfo);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    } finally {
      const randomDelay = Math.floor(Math.random() * 2000); // 0초에서 2초 사이 랜덤 값
      console.log(
        `${profileId} 데이터 수집 완료 ... ${randomDelay}ms 동안 sleep ...`
      );
      await delay(randomDelay); // API 호출 간의 지연
    }
  }

  const json = arrayToJSON(users);
  const formattedDate = getFormattedDate();
  const fileName = `[${formattedDate}]RememberUsers.json`;
  downloadJSON(json, fileName);
}

/**
 * Starts the Google URL scraping process for LinkedIn profiles.
 */
function scrapeGoogleUrlData() {
  const linkedInLinks = Array.from(document.querySelectorAll("#center_col a"))
    .filter(
      (a) =>
        a.href &&
        a.href.includes("linkedin.com") &&
        !a.href.includes("//id.") &&
        !a.href.includes("//in.") &&
        !a.href.includes("//bd.") &&
        !a.href.includes("//my.") &&
        !a.href.includes("//se.") &&
        !a.href.includes("//ml") &&
        !a.href.includes("//ng") &&
        !a.href.includes("//br") &&
        !a.href.includes("//bg") &&
        !a.href.includes("//gr") &&
        !a.href.includes("//au") &&
        !a.href.includes("//py") &&
        !a.href.includes("//rs") &&
        !a.href.includes("//cz") &&
        !a.href.includes("//hu") &&
        !a.href.includes("//ca") &&
        !a.href.includes("//uk") &&
        !a.href.includes("//be") &&
        !a.href.includes("//cn") &&
        !a.href.includes("//jp") &&
        !a.href.includes("//de") &&
        !a.href.includes("//sg") &&
        !a.href.includes("//kz") &&
        !a.href.includes("//th") &&
        !a.href.includes("//tw") &&
        !a.href.includes("//nz") &&
        !a.href.includes("//pl") &&
        !a.href.includes("https://www.google.com/search")
    )
    .map((a) => a.href);

  // Set을 사용하여 중복 값 제거
  const uniqueLinkedInLinks = Array.from(new Set(linkedInLinks));

  // 배열을 텍스트로 변환
  const content = uniqueLinkedInLinks.join("\n");

  // Blob 객체 생성
  const blob = new Blob([content], { type: "text/plain" });

  // Blob을 가리키는 URL 생성
  const url = URL.createObjectURL(blob);

  // 다운로드를 위한 링크 생성
  const a = document.createElement("a");
  a.href = url;
  a.download = "linkedin_links.txt";

  // 링크를 클릭하여 파일 다운로드
  document.body.appendChild(a);
  a.click();

  // 사용된 URL 및 링크 정리
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startLinkedinScraping") {
    logVersion();
    scrapeLinkedInData(message.count, message.sleep);
  } else if (message.action === "startRememberScraping") {
    logVersion();
    scrapeRememberData(
      message.token,
      message.userAgent,
      message.totalPageCount
    );
  } else if (message.action === "googleUrlScraping") {
    logVersion();
    scrapeGoogleUrlData();
  }
});
