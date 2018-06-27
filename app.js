// Budget Controller
const budgetController = (function() {})();

// UI Controller
const uiController = (function() {
  const DOMSelectors = {
    addType: '.add__type',
    addDescription: '.add__description',
    addValue: '.add__value',
    addBtn: '.add__btn',
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMSelectors.addType).value,
        desc: document.querySelector(DOMSelectors.addDescription).value,
        value: document.querySelector(DOMSelectors.addValue).value,
      };
    },
    getDOMSelectors: function() {
      return DOMSelectors;
    },
  };
})();

// App Controller
const appController = (function(budgetCtrl, uiCtrl) {
  const DOMSelectors = uiCtrl.getDOMSelectors();
  const ctrlAddItem = function() {
    // Get field input data
    const input = uiCtrl.getInput();
    console.log(input);
    // Add item to the budgetCtrl
    // Add item to the UI
    // Calculate budget
    // Display budget on the
  };

  document.querySelector(DOMSelectors.addBtn).addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function(e) {
    if (e.keyCode === 13 || e.which === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, uiController);
