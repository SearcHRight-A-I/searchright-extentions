const fs = require("fs");
const path = require("path");
const { mergePeriods, calculateTotalDuration } = require("../content.js");
const {
  sample1,
  sample2,
  sample3,
  sample4,
  sample5,
  sample6,
  sample7,
  sample8,
} = require("./samples.js");

const testSamples = [
  sample1, // 10
  sample2, // 10
  sample3, // 10
  sample4, // 10
  sample5, // 10
  sample6, // 13
  sample7, // 13
  sample8, // 5
];

for (const sample of testSamples) {
  const positions = sample.positions;

  try {
    // 총 근무 기간 계산
    const mergedPositions = mergePeriods(
      positions.map((pos) => pos.startEndDate)
    );
    console.log("=================[ 회사 연차 계산 평탄화 ]=================");
    console.log(mergedPositions);

    // 총 연차 계산
    console.log("=============[ 평탄화된 데이터로 총연차 계산 ]=============");
    console.log(calculateTotalDuration(mergedPositions));
  } catch (error) {
    console.error("Error fetching table data:", error);
  }
}

// file base 로 체크해보기
// Load and parse the JSON data
const rawData = fs.readFileSync(
  path.join(__dirname, "[2024-11-04]LinkedinUsers.json"),
  "utf-8"
);
const fileLinkedinUsers = JSON.parse(rawData);

for (const sample of fileLinkedinUsers) {
  const positions = sample.positions;

  try {
    // 총 근무 기간 계산
    const mergedPositions = mergePeriods(
      positions.map((pos) => pos.startEndDate)
    );
    // console.log("=================[ 회사 연차 계산 평탄화 ]=================");
    // console.log(mergedPositions);

    // 총 연차 계산
    const calculatedDuration = calculateTotalDuration(mergedPositions);
    const actualDuration = sample.totalDuration; // JSON에 포함된 총 연차
    console.log("=============[ 평탄화된 데이터로 총연차 계산 ]=============");
    console.log("Calculated Duration:", calculatedDuration);
    console.log("Actual Duration from JSON:", actualDuration);
  } catch (error) {
    console.error("Error fetching table data:", error);
  }
}
