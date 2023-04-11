import FT from "fmp-tti";
let id = 0;
let URL = "http://139.155.69.214:8083";
// let URL = "http://127.0.0.1:8083";
const minimonitornpm = {
  install: function (Vue) {
    const indicators = {};
    let {
      domainLookupEnd,
      domainLookupStart,
      connectEnd,
      connectStart,
      requestStart,
      responseEnd,
      responseStart,
      navigationStart,
      loadEventStart,
      loadEventEnd,
    } = performance.timing;
    indicators.dns = domainLookupEnd - domainLookupStart;
    indicators.tcp = connectEnd - connectStart;
    indicators.requestPending = responseStart - requestStart;
    indicators.documentDown = responseEnd - responseStart;
    indicators.onload = loadEventEnd - loadEventStart;
    indicators.whiteScreen = responseStart - navigationStart;
    indicators.jsmemoey =
      Math.floor(
        (performance.memory.usedJSHeapSize /
          performance.memory.totalJSHeapSize) *
          1000
      ) /
        10 +
      "%";
    // 捕获 异步 错误
    FT.then(({ fcp, fmp, tti }) => {
      indicators.fcp = fcp;
      indicators.fmp = fmp;
      indicators.tti = tti;
      // console.log("首次内容绘制（FCP） - %dms", fcp);
      // console.log("首次有意义绘制（FMP） - %dms", fmp);
      // console.log("可交互时间（TTI） - %dms", tti);
      const syncRequest = (url, data = {}) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, false);
        xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        xhr.send(JSON.stringify(data));
      };
      syncRequest(URL + "/saveIndicators", indicators);
    });
    window.onerror = function (msg, url, row, col, error) {
      let path = url.replace(/(\.)|(=)/g, "-");
      let e = {
        id: ++id,
        type: "异步报错",
        href: location.href,
        msg: error.toString(),
        path,
      };
      add(e);
      return true;
    };
    Vue.config.errorHandler = function (err, vm, info) {
      let e = {
        id: ++id,
        type: info,
        href: location.href,
        msg: err.toString(),
      };
      add(e);
    };

    // 专门 捕获404 捕获404  但不能去掉红色  报警处理
    window.addEventListener(
      "error",
      (msg, url, row, col, error) => {
        let e = {};

        if (msg) {
          switch (msg.target.tagName) {
            case "IMG":
              e = {
                id: ++id,
                sendEmail: true,
                type: "img",
                href: location.href,
                msg: "图片加载错误 可能是 src 找不到",
              };
              break;

            default:
              break;
          }
        }
        add(e);
      },
      true
    );
    // promise reject
    window.addEventListener("unhandledrejection", (event) => {
      let e = {};
      if (event) {
        switch (event.reason.name) {
          case "AxiosError":
            e = {
              id: ++id,
              type: "AxiosError",
              href: location.href,
              msg: event.reason.message,
            };
            break;

          default:
            e = {
              id: ++id,
              type: "promise reject",
              href: location.href,
              msg: "Promise 出现 reject",
            };
            break;
        }

        e.id && add(e);
      }

      event.preventDefault();
    });
  },
};
function add(data) {
  if (!data.id) return;
  const blob = new Blob([JSON.stringify(data)], {
    type: "application/x-www-form-urlencoded",
  });
  navigator.sendBeacon(URL + "/add1", blob);
}
console.log("2023", 2023);

export { minimonitornpm };
export default minimonitornpm;
