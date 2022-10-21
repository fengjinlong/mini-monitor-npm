const minimonitornpm = {
  install: function (Vue) {
    window.onerror = function (msg, url, row, col, error) {
      console.log(msg, url, row, col, error);
      return true;
    };
    Vue.config.errorHandler = function (err, vm, info) {
      //   handleVueError.apply(null, [
      //     err,
      //     vm,
      //     info,
      //     Severity.Normal,
      //     Severity.Error,
      //     Vue,
      //   ]);
      // console.error(
      //   "Error 666 in " + info + ': "' + err.toString() + '"',
      //   vm
      // );
      console.log(err.toString());
      console.log(vm);
      console.log(info);
      // 错误信息
      // const data = {
      //   message: err.message,
      //   stack: err.stack,
      //   info,
      //   href: location.href
      // }
    };

    // 404 捕获404  但不能去掉红色  报警处理
    window.addEventListener(
      "error",
      (msg, url, row, col, error) => {
        console.log(msg, url, row, col, error);
      },
      true
    );
    // promise reject
    window.addEventListener("unhandledrejection", (event) => {
      // console.log(location.href);
      console.info(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
      // console.log("pr", JSON.stringify(event));

      event.preventDefault();
    });
  },
};

export { minimonitornpm };
export default minimonitornpm;
