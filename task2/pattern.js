const N = 9;
const T = "a";

const generatePattern = (N, T) => {
  const t = T === "a" ? 97 : 1;
  const n = t + N - 1;

  let row = "";

  for (let i = t; i <= n; i++) {
    T === "a" ? (row += String.fromCharCode(i)) : (row += i.toString());
  }
  row += "\n";

  let start = t;
  let end = n;
  for (let i = t + 1; i < n; i++) {
    for (let j = t + 1; j <= n + 1; j++) {
      if (j == t + 1 || j == n + 1) {
        if (T == "a") {
          j == t + 1
            ? (row += String.fromCharCode(start + 1))
            : (row += String.fromCharCode(end - 1));
        } else {
          j == t + 1 ? (row += start + 1) : (row += end - 1);
        }
      } else row += " ";
    }
    start++;
    end--;
    row += "\n";
  }

  for (let i = n; i >= t; i--) {
    T === "a" ? (row += String.fromCharCode(i)) : (row += i.toString());
  }

  return row;
};

console.log(generatePattern(N, T));
