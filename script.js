const display = document.getElementById("display");
const history = document.getElementById("history");
const buttons = document.querySelectorAll("button");

let expression = "";

function updateDisplay() {
  display.textContent = expression || "0";
}

function appendValue(value) {
  const operators = "+-*/%";

  if (operators.includes(value)) {
    if (!expression) return;
    if (operators.includes(expression.at(-1))) {
      expression = expression.slice(0, -1) + value;
      updateDisplay();
      return;
    }
  }

  if (value === ".") {
    const currentNumber = expression.split(/[+\-*/%]/).pop();
    if (currentNumber.includes(".")) return;
    if (!currentNumber) expression += "0";
  }

  expression += value;
  updateDisplay();
}

function clearCalculator() {
  expression = "";
  history.textContent = "";
  updateDisplay();
}

function deleteLast() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function calculate() {
  if (!expression) return;

  try {
    const safeExpression = expression.replace(/%/g, "/100");
    const result = Function(`"use strict"; return (${safeExpression})`)();

    if (!Number.isFinite(result)) {
      throw new Error("Invalid result");
    }

    history.textContent = expression + " =";
    expression = String(Number(result.toFixed(10)));
    updateDisplay();
  } catch {
    display.textContent = "Error";
    expression = "";
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (value) appendValue(value);
    if (action === "clear") clearCalculator();
    if (action === "delete") deleteLast();
    if (action === "calculate") calculate();
  });
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if ("0123456789.+-*/%".includes(key)) {
    appendValue(key);
  } else if (key === "Enter" || key === "=") {
    calculate();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape") {
    clearCalculator();
  }
});
