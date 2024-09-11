const VERSION = "1.5.240911";

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

// 쿠키에서 특정 쿠키 값을 추출하는 함수
function getCookieValue(name) {
  let match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
  return null;
}

const fetchProfile = async (profileUrn, csrfToken) => {
  const res = await fetch(
    `https://www.linkedin.com/talent/api/talentLinkedInMemberProfiles/urn%3Ali%3Ats_linkedin_member_profile%3A(${profileUrn}%2C1%2Curn%3Ali%3Ats_hiring_project%3A0)`,
    {
      method: "POST",
      headers: {
        Host: "www.linkedin.com",
        Connection: "keep-alive",
        "sec-ch-ua":
          '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        "sec-ch-ua-mobile": "?0",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        Accept: "application/json",
        "Csrf-Token": csrfToken,
        "X-RestLi-Protocol-Version": "2.0.0",
        "x-http-method-override": "GET",
        "sec-ch-ua-platform": '"macOS"',
        Origin: "https://www.linkedin.com",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        Referer: "https://www.linkedin.com/talent/search/profile",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: document.cookie,
      },
      body: "altkey=urn&decoration=%28entityUrn%2CcurrentResumePosition%2CreferenceUrn%2Canonymized%2CunobfuscatedFirstName%2CunobfuscatedLastName%2CmemberPreferences%28availableStartingAt%2Clocations%2CgeoLocations*~%28standardGeoStyleName%29%2CopenToNewOpportunities%2Ctitles%2CinterestedCandidateIntroductionStatement%2Cindustries*~%2CcompanySizeRange%2CemploymentTypes%2Cbenefits%2Cschedules%2CsalaryLowerBounds%2Ccommute%2CjobSeekingUrgencyLevel%2CopenToWorkRemotely%2ClocalizedWorkplaceTypes%2CremoteGeoLocationUrns*~%28standardGeoStyleName%29%2CsegmentAttributeGroups*%28attributeUrn~%28localizedName%29%2CattributeValueUrns*~%28localizedName%29%29%29%2CfirstName%2ClastName%2Cheadline%2Clocation%2CprofilePicture%2CvectorProfilePicture%2CnumConnections%2Csummary%2CnetworkDistance%2CprofileSkills*%28name%2CtopSkill%2CtopVoiceBadge%2CskillAssessmentBadge%2CprofileResume%2CendorsementCount%2CprofileSkillAssociationsGroupUrn~%28entityUrn%2Cassociations*%28description%2Ctype%2CorganizationUrn~%28name%2Curl%2Clogo%29%29%29%2ChasInsight%29%2CpublicProfileUrl%2CcontactInfo%2Cwebsites*%2CcanSendInMail%2Cunlinked%2CunLinkedMigrated%2Chighlights%28connections%28connections*~%28entityUrn%2CfirstName%2ClastName%2Cheadline%2CprofilePicture%2CvectorProfilePicture%2CpublicProfileUrl%2CfollowerCount%2CnetworkDistance%2CautomatedActionProfile%29%2CtotalCount%29%2Ccompanies%28companies*%28company~%28followerCount%2Cname%2Curl%2CvectorLogo%29%2CoverlapInfo%29%29%2Cschools%28schools*%28school~%28name%2Curl%2CvectorLogo%29%2CschoolOrganizationUrn~%28name%2Curl%2Clogo%29%2CoverlapInfo%29%29%29%2CfollowingEntities%28companies*~%28followerCount%2Cname%2Curl%2CvectorLogo%29%2Cinfluencers*~%28entityUrn%2CfirstName%2ClastName%2Cheadline%2CprofilePicture%2CvectorProfilePicture%2CpublicProfileUrl%2CfollowerCount%2CnetworkDistance%2CautomatedActionProfile%29%2Cschools*~%28name%2Curl%2CvectorLogo%29%2CschoolOrganizationsUrns*~%28name%2Curl%2Clogo%29%29%2Ceducations*%28school~%28name%2Curl%2CvectorLogo%29%2CorganizationUrn~%28name%2Curl%2Clogo%29%2CschoolName%2Cgrade%2Cdescription%2CdegreeName%2CfieldOfStudy%2CstartDateOn%2CendDateOn%29%2CgroupedWorkExperience*%28companyUrn~%28followerCount%2Cname%2Curl%2CvectorLogo%29%2Cpositions*%28profileResume%2Ctitle%2CstartDateOn%2CendDateOn%2Cdescription%2Clocation%2CemploymentStatus%2CorganizationUrn%2CcompanyName%2CassociatedProfileSkillNames%2CcompanyUrn~%28url%2CvectorLogo%29%29%2CstartDateOn%2CendDateOn%29%2CvolunteeringExperiences*%28company~%28followerCount%2Cname%2Curl%2CvectorLogo%29%2CcompanyName%2Crole%2CstartDateOn%2CendDateOn%2Cdescription%29%2Crecommendations*%28recommender~%28entityUrn%2CfirstName%2ClastName%2Cheadline%2CprofilePicture%2CvectorProfilePicture%2CpublicProfileUrl%2CfollowerCount%2CnetworkDistance%2CautomatedActionProfile%29%2CrecommendationText%2Crelationship%2Ccreated%29%2Caccomplishments%28projects*%28title%2Cdescription%2Curl%2CstartDateOn%2CendDateOn%2CsingleDate%2Ccontributors*%28name%2ClinkedInMember~%28entityUrn%2Canonymized%2CunobfuscatedFirstName%2CunobfuscatedLastName%2CfirstName%2ClastName%2Cheadline%2CprofilePicture%2CvectorProfilePicture%2CpublicProfileUrl%2CfollowerCount%2CnetworkDistance%2CautomatedActionProfile%29%29%29%2Ccourses*%2Clanguages*%2Cpublications*%28name%2Cpublisher%2Cdescription%2Curl%2CdateOn%2Cauthors*%28name%2ClinkedInMember~%28entityUrn%2Canonymized%2CunobfuscatedFirstName%2CunobfuscatedLastName%2CfirstName%2ClastName%2Cheadline%2CprofilePicture%2CvectorProfilePicture%2CpublicProfileUrl%2CfollowerCount%2CnetworkDistance%2CautomatedActionProfile%29%29%29%2Cpatents*%28number%2CapplicationNumber%2Ctitle%2Cissuer%2Cpending%2Curl%2CfilingDateOn%2CissueDateOn%2Cdescription%2Cinventors*%28name%2ClinkedInMember~%28entityUrn%2Canonymized%2CunobfuscatedFirstName%2CunobfuscatedLastName%2CfirstName%2ClastName%2Cheadline%2CprofilePicture%2CvectorProfilePicture%2CpublicProfileUrl%2CfollowerCount%2CnetworkDistance%2CautomatedActionProfile%29%29%29%2CtestScores*%2Chonors*%2Ccertifications*%28name%2ClicenseNumber%2Cauthority%2Ccompany~%28followerCount%2Cname%2Curl%2CvectorLogo%29%2Curl%2CstartDateOn%2CendDateOn%29%29%2CprivacySettings%28allowConnectionsBrowse%2CshowPremiumSubscriberIcon%29%2ClegacyCapAuthToken%2CfullProfileNotVisible%2CcurrentPositions*%28company~%28followerCount%2Cname%2Curl%2CvectorLogo%29%2CcompanyName%2Ctitle%2CstartDateOn%2CendDateOn%2Cdescription%2Clocation%29%2CindustryName%2ChasProfileVerifications%29",
    }
  );

  if (res.ok) {
    return await res.json();
  }
};

const fetchProfileCompanies = async (profileUrn, csrfToken) => {
  const res = await fetch(
    `https://www.linkedin.com/talent/api/talentLinkedInMemberProfiles/urn%3Ali%3Ats_linkedin_member_profile%3A(${profileUrn}%2C1%2Curn%3Ali%3Ats_hiring_project%3A0)?altkey=urn&decoration=%28entityUrn%2CreferenceUrn%2Canonymized%2CunobfuscatedFirstName%2CunobfuscatedLastName%2CfirstName%2ClastName%2Cheadline%2Clocation%2CpublicProfileUrl%2CcurrentPositions*%28companyName%2Ctitle%29%29`,
    {
      method: "POST",
      headers: {
        Host: "www.linkedin.com",
        Connection: "keep-alive",
        "sec-ch-ua":
          '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        "sec-ch-ua-mobile": "?0",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        Accept: "application/json",
        "Csrf-Token": csrfToken,
        "X-RestLi-Protocol-Version": "2.0.0",
        "x-http-method-override": "GET",
        "sec-ch-ua-platform": '"macOS"',
        Origin: "https://www.linkedin.com",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        Referer: "https://www.linkedin.com/talent/search/profile",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: document.cookie,
      },
    }
  );

  if (res.ok) {
    return await res.json();
  }
};

const parsingLinkedinLogo = (data) => {
  // static file pattern 이 2 depth 이상이라 분리
  // 프로필 사진, 회사 사진 등에 활용
  const rootUrl = data?.rootUrl ?? "";
  const artifacts = data?.artifacts;
  const fileSegment =
    artifacts?.length > 0
      ? artifacts[artifacts.length - 1]?.fileIdentifyingUrlPathSegment ?? ""
      : "";
  const photoUrl = rootUrl + fileSegment;
  return photoUrl;
};

/**
 * Merges overlapping periods and calculates the total duration.
 * @param {Array<Object>} periods - The array of period objects.
 * @returns {Array<Object>} The merged array of period objects.
 */
function mergePeriods(periods) {
  if (!periods || periods.length === 0) {
    return []; // 빈 배열 처리
  }

  // 유효한 기간만 필터링 (start가 있는 기간만)
  periods = periods.filter((period) => period !== null && period.start);

  if (periods.length === 0) {
    return []; // 필터링 후 남은 기간이 없으면 빈 배열 반환
  }

  // 시작 날짜 기준으로 정렬
  periods.sort(
    (a, b) =>
      new Date(a.start.year, a.start.month ? a.start.month - 1 : 0) -
      new Date(b.start.year, b.start.month ? b.start.month - 1 : 0)
  );

  const merged = [];
  let current = { ...periods[0] }; // 첫 번째 기간을 현재로 설정

  // 시작 month가 없을 경우 1월로 설정
  if (!current.start.month) {
    current.start.month = 1;
  }

  for (let i = 1; i < periods.length; i++) {
    const period = periods[i];

    // start에 month 값이 없으면 1월로 설정
    if (!period.start.month) {
      period.start.month = 1;
    }

    // current의 end가 없으면 다음 period의 start로 end를 설정
    if (!current.end) {
      current.end = {
        year: period.start.year,
        month: period.start.month || 1, // 월이 없으면 1월로 설정
      };
    }

    const currentEndDate = new Date(
      current.end.year,
      current.end.month ? current.end.month - 1 : 11
    ); // 끝나는 월이 없으면 12월로 설정
    const periodStartDate = new Date(
      period.start.year,
      period.start.month ? period.start.month - 1 : 0
    ); // 시작 월이 없으면 1월로 설정

    if (currentEndDate >= periodStartDate) {
      const periodEndDate = period.end
        ? new Date(
            period.end.year,
            period.end.month ? period.end.month - 1 : 11
          ) // 끝나는 월이 없으면 12월로 설정
        : null;

      // 현재 끝나는 날짜보다 더 긴 기간이 있으면 끝나는 날짜 업데이트
      if (!periodEndDate || currentEndDate < periodEndDate) {
        current.end = period.end
          ? { ...period.end }
          : { year: period.start.year, month: period.start.month || 12 }; // 끝나는 날짜 또는 기본값 적용
      }
    } else {
      // end의 month가 없으면 12월로 설정
      if (!current.end.month) {
        current.end.month = 12;
      }
      merged.push(current);
      current = { ...period };
      // 시작 month가 없을 경우 1월로 설정
      if (!current.start.month) {
        current.start.month = 1;
      }
    }
  }

  // 마지막 기간 처리 (end가 없을 경우)
  if (!current.end) {
    current.end = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    };
  } else if (!current.end.month) {
    current.end.month = 12; // 마지막 기간의 end month가 없으면 12월로 설정
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
 * Parses data from the target LinkedIn profile api response data
 * @param {string} data - A data from linkedin recruite - lite api
 * @returns {Promise<Object>} A promise that resolves to an object containing the parsed data.
 */
async function linkedinFormattedData(data) {
  // 헤드라인
  const headline = data?.headline || "";

  // 서머리
  const summary = data?.summary || "";

  // 이름
  const firstName = data?.firstName || "";
  const lastName = data?.lastName || "";

  // 링크드인 프로필 url
  const linkedinUrl = data.publicProfileUrl || "";
  if (!linkedinUrl)
    throw new Error("LinkedIn URL 값은 필수입니다. 없으면 skip 합니다.");

  // 프로필 사진
  const photoUrl = parsingLinkedinLogo(data?.vectorProfilePicture);

  // 학력
  const educationsNode = data.educations || [];
  let educations = [];
  educationsNode.forEach((edu) => {
    const startYear = edu.startDateOn?.year ?? "";
    const endYear = edu.endDateOn?.year ?? "";

    const tempObj = {
      degreeName: edu.degreeName || "",
      fieldOfStudy: edu.fieldOfStudy || "",
      schoolName: edu.schoolName || "",
      startEndDate: `${startYear} - ${endYear}`,

      // 아래는 1.5 version 이후 신규 추가된 항목
      description: edu.description || "",
      grade: edu.grade || "",
      originStartEndDate: {
        startDateOn: edu.startDateOn,
        endDateOn: edu.endDateOn,
      },
    };
    educations.push(tempObj);
  });

  // 스킬
  const skillsNode = data.profileSkills || [];
  let skills = [];
  skillsNode.forEach((skillSet) => {
    const skillName = skillSet.name || "";
    if (skillName) skills.push(skillName);
  });

  // 회사
  const positionsNode = data.groupedWorkExperience || [];
  let positions = [];
  positionsNode.forEach((position) => {
    const positionDetail = position.positions || [];
    positionDetail.forEach((pos) => {
      const tempObj = {
        companyName: pos.companyName || "",
        title: pos.title || "",
        companyLocation: pos.location?.displayName || "",
        description: pos?.description || "",
        companyLogo: parsingLinkedinLogo(
          pos?.companyUrnResolutionResult?.vectorLogo
        ),
        startEndDate: {
          start: pos.startDateOn,
        },
      };

      // 끝나는 날 있으면 추가
      if (pos?.endDateOn) tempObj.startEndDate.end = pos.endDateOn;
      positions.push(tempObj);
    });
  });

  // 그 외 웹사이트
  const websiteNodes = data.websites || [];
  const website = websiteNodes.map((web) => {
    return `${web.url} - ${web.category}`;
  });

  // 총 근무 기간 계산
  const mergedPositions = mergePeriods(
    positions.map((pos) => pos.startEndDate)
  );
  const totalDuration =
    mergedPositions.length > 0 ? calculateTotalDuration(mergedPositions) : null;

  // 신규 추가된 값
  const industryName = data.industryName || "";
  const highlights = data.highlights || [];
  const projects = data.projects || [];

  // recommendations
  const recommendationNodes = data.recommendations || [];
  const recommendations = recommendationNodes.map((reco) => {
    const referee = reco?.recommenderResolutionResult?.publicProfileUrl || "";
    return {
      referee,
      recommendationText: reco.recommendationText,
    };
  });

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
    // 1.5 version 이후 신규 추가
    industryName,
    // highlights,
    projects,
    recommendations,
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
function rememberFormattedData(profileId, data) {
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
  const totalDuration =
    mergedPeriods.length > 0 ? calculateTotalDuration(mergedPeriods) : null;

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
 * Starts the LinkedIn scraping process for one profile.
 * @param {string} userUrn - The unique value of target profile to scrape.
 */
function scrapeTargetLinkedInData(userUrn) {
  const csrfToken = getCookieValue("JSESSIONID").replaceAll('"', "");
  const users = [];
  async function scrapePage() {
    const result = await fetchProfile(userUrn, csrfToken);
    const userInfo = await linkedinFormattedData(result);
    users.push(userInfo);

    // json 형태 포메팅하기
    const filteredUsers = users.filter((user) => user.linkedinUrl);
    const json = arrayToJSON(filteredUsers);
    const formattedDate = getFormattedDate();
    const fileName = `[${formattedDate}]${userInfo.lastName}${userInfo.firstName}.json`;
    downloadJSON(json, fileName);
  }
  scrapePage();
}

/**
 * Starts the LinkedIn scraping process.
 * @param {number} scrapingCount - The number of profiles to scrape.
 * @param {number} sleepCount - The delay between scrapes in milliseconds.
 */
function scrapeLinkedInData(scrapingPageCount, sleepCount) {
  const csrfToken = getCookieValue("JSESSIONID").replaceAll('"', "");

  let cnt = 1;
  const users = [];
  async function scrapePage() {
    try {
      // CSR 때문에 일단 가장 하단 화면으로
      while (window.scrollY + window.innerHeight < document.body.scrollHeight) {
        window.scrollTo({
          top: window.scrollY + document.body.scrollHeight - 100,
          behavior: "smooth",
        });
        await delay(800);
      }

      // 타겟 profile urn 값들 가져오기
      const profileUrnTags = document.querySelectorAll(
        "a[data-test-link-to-profile-link]"
      );

      // api 호출
      for (let i = 0; i < profileUrnTags.length; i++) {
        const profileUrn = profileUrnTags[i]
          .getAttribute("href")
          .split("?")[0]
          .split("profile/")[1];
        const result = await fetchProfile(profileUrn, csrfToken);
        console.log(`${cnt} 번째 페이지, ${i} 번째 데이터 수집 완료`);

        // 데이터 파싱 필요
        const userInfo = await linkedinFormattedData(result);
        users.push(userInfo);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    } finally {
      // 다음 페이지로
      const nextPageBtn = document.querySelector(
        "a.mini-pagination__quick-link.link-without-hover-visited"
      );
      if (nextPageBtn) nextPageBtn.click();
      console.log(
        `${cnt} 번째 페이지 데이터 수집 완료 ... ${sleepCount}ms 동안 sleep ...`
      );
      await delay(sleepCount);
    }

    cnt++;
    scrapingPageCount--;
    if (scrapingPageCount > 0) {
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
        const userInfo = rememberFormattedData(profileId, data);
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
  } else if (message.action === "startLinkedinTargetScraping") {
    logVersion();
    scrapeTargetLinkedInData(message.userUrn);
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
