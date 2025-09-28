// clicked
let convert = document.querySelector(".convert");
let reset = document.querySelector(".reset");
let res = document.querySelector(".res");
let copy = document.querySelector(".copy");

//other
let letters = "abcdefghijklmnopqrstuvwxyz";
let result = "";

convert.onclick = function () {
  let userInput= document.querySelector(".user-input").value;
  result = "";
  for (let i = 0; i < userInput.length; i++) {
    let char = userInput[i];
    if (char === " ") {
      result += " ";
      continue;
    }
    let p = letters.indexOf(char.toLowerCase());
    if (p === -1) {
      result += char;
      continue;
    }
    p = (p + 3) % letters.length;
    if (char === char.toUpperCase()) {
      result += letters[p].toUpperCase();
    } else {
      result += letters[p];
    }
  }

  res.style.display = "flex";
  res.innerText = result;
};

reset.onclick = function () {
  let userInput = document.querySelector(".user-input");
  res.style.display = "none";
  userInput.value = "";
};

copy.onclick = function () {
  let res = document.getElementById("res").innerText;
  navigator.clipboard.writeText(res);
  let popup = document.getElementById("popup");
  popup.classList.add("show");
  setTimeout(() => {
    popup.classList.remove("show");
  }, 2000);
};
