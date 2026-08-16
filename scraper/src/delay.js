function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function randomDelay(minMilliseconds = 1000, maxMilliseconds = 2000) {
  const delay =
    Math.floor(
      Math.random() *
        (maxMilliseconds - minMilliseconds + 1)
    ) + minMilliseconds;

  return sleep(delay);
}

module.exports = {
  sleep,
  randomDelay,
};