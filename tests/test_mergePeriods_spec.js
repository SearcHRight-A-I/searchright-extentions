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

const positions = [
  {
    companyName: "Blockpour",
    title: "Senior Software Engineer",
    companyLocation: "Seoul, South Korea",
    description: "",
    companyLogo:
      "https://media.licdn.com/dms/image/v2/D560BAQGLwYugWBOnsg/company-logo_400_400/company-logo_400_400/0/1684921149427/blockpour_logo?e=1733961600&v=beta&t=NTfQ9W1fPKTXAUAcsC7VM8hA2GvmicyWyMD-5stxkPQ",
    startEndDate: {
      start: {
        year: 2022,
      },
    },
  },
  {
    companyName: "Faster AI",
    title: "Software Engineer & Quantitative Trader",
    companyLocation: "",
    description: "▪Details under NDA but can be obtained through reference",
    companyLogo: "",
    startEndDate: {
      start: {
        year: 2020,
      },
      end: {
        year: 2021,
      },
    },
  },
  {
    companyName: "Xendit",
    title: "Backend Software Engineer",
    companyLocation: "Remote",
    description:
      '▪Developed backend "connectors" with 10+ Philippino traditional banks using open banking APIs and connectors with crypto payment platforms (such as coins.ph).\n▪Integrated new Philippines infrastructure with the existing Indonesia payments infrastructure.\n▪Load tested infrastructure before production launch.',
    companyLogo:
      "https://media.licdn.com/dms/image/v2/C4D0BAQEFJPFvzTYq5A/company-logo_400_400/company-logo_400_400/0/1630456612741/xendit_logo?e=1733961600&v=beta&t=r1qtYMbtqltv-Oj_1-4PnDcS607mz7iWa8x2jf0i5yY",
    startEndDate: {
      start: {
        month: 12,
        year: 2019,
      },
      end: {
        month: 3,
        year: 2020,
      },
    },
  },
  {
    companyName: "JPMorgan Chase & Co.",
    title: "Quorum Ambassador (Developer Advocate)",
    companyLocation: "Seoul, South Korea",
    description:
      "▪Responsible for promoting, providing tech support for the Quorum blockchain (JP Morgan's private fork of Ethereum). \n▪Organized a hackathon and a Quorum blockchain meetup.",
    companyLogo:
      "https://media.licdn.com/dms/image/v2/D4E0BAQGxpntCyRgsuA/company-logo_400_400/company-logo_400_400/0/1718711710850/jpmorganchase_logo?e=1733961600&v=beta&t=Zjlted86PSKYjp583FGegZOqS0vc1NmbQFjWPoadCMg",
    startEndDate: {
      start: {
        month: 2,
        year: 2019,
      },
      end: {
        month: 2,
        year: 2020,
      },
    },
  },
  {
    companyName: "Proofsuite (Startup)",
    title: "Lead Developer",
    companyLocation: "Seoul, KR",
    description:
      "Proofsuite was a crypto-startup building decentralized applications and data products. I worked as lead-developer on multiple products including:\n▪A decentralized exchange on Ethereum (back-end, front-end and settlement layer).\n▪A tokenized real-estate platform on Ethereum (back-end, front-end).\n▪Developed and deployed various smart contracts. Smart-contract services for client companies.",
    companyLogo: "",
    startEndDate: {
      start: {
        year: 2016,
      },
      end: {
        year: 2020,
      },
    },
  },
];

// 총 근무 기간 계산
const mergedPositions = mergePeriods(positions.map((pos) => pos.startEndDate));
console.log(mergedPositions);
