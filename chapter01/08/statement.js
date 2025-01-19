const invoices = require("../invoices.json");
const plays = require("../plays.json");
const createStatementData = require("./createStatementData");

function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays)); // 변수 인라인하기
}

function hemlStatement(invoice, plays) {
  return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data) {
  let result = `<h1>청구 내역 (고객명: ${data.customer})</h1>\n`;
  result += "<table>\n";
  result += "<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>";
  for (let perf of data.performances) {
    result += ` <tr><td>${perf.play.name}</td><td>(${perf.audience})</td>`;
    result += `<td>${usd(perf.amount)}</td></tr>`;
  }
  result += "</table>\n";
  result += `<p>총액: <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p>적립 포인트: <em>${data.totalVolumeCredits}</em>점</p>\n`;
  return result;
}

function renderPlainText(data) {
  let result = `청구 내역 (고객명: ${data.customer})\n`;
  for (let perf of data.performances) {
    result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`; // 변수 인라인하기
  }
  result += `총액 ${usd(data.totalAmount)}\n`; // 변수 인라인하기
  result += `적립 포인트 ${data.totalVolumeCredits}점\n`; // 변수 인라인하기
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

const result = statement(invoices[0], plays);
console.log(result);
const htmlResult = hemlStatement(invoices[0], plays);
console.log(htmlResult);
