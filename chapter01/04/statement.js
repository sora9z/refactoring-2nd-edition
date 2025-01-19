const invoices = require("../invoices.json");
const plays = require("../plays.json");

function statement(invoice, plays) {
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  for (let perf of invoice.performances) {
    result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${
      perf.audience
    }석)\n`; // 변수 인라인하기
  }

  result += `총액 ${usd(totalAmount())}\n`; // 변수 인라인하기
  result += `적립 포인트 ${totalVolumeCredits()}점\n`; // 변수 인라인하기

  return result;

  // totalAmount변수를 별도의 for문으로 추출하는 반복문 쪼개기, 함수로 추출하기를 통한 totalAmount 임시변수 제거
  function totalAmount() {
    let result = 0;
    for (const perf of invoice.performances) {
      result += amountFor(perf);
    }
    return result;
  }

  // volumeCredits를 별도의 for문으로 추출하는 반복분 쪼개기, 함수로 추출하기를 통한 volumeCredits 임시변수 제거
  function totalVolumeCredits() {
    let result = 0;
    for (const perf of invoice.performances) {
      result += volumeCreditsFor(perf);
    }
    return result;
  }

  // format 임시변수를 함수로 추출하기를 통한 format 암시변수 제거
  function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber / 100); // 단위 변환도 이동
  }

  // 포인트 적립 계산 함수 추출
  function volumeCreditsFor(perf) {
    let result = 0;
    result += Math.max(perf.audience - 30, 0);
    // 희극 관객 5명마다 추가 포인트를 제공한다
    if ("comedy" === playFor(perf).type) {
      result += Math.floor(perf.audience / 5);
    }
    return result;
  }

  // 공연료 계산 함수 추출
  function amountFor(aPerformance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
      case "tragedy": // 비극
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy": // 희극
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
    }
    return result;
  }

  // amountFor의 play임시 변수룰 함수로 추출하기를 통한 play 암시변수 제거
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }
}

const result = statement(invoices[0], plays);
console.log(result);
