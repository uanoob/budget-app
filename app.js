// Budget Controller
const budgetController = (function() {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  const data = {
    allItems: {
      exp: [],
      inc: [],
    },
    total: {
      exp: 0,
      inc: 0,
    },
  };
})();

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
        description: document.querySelector(DOMSelectors.addDescription).value,
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
  const setupEventListeners = function() {
    const DOMSelectors = uiCtrl.getDOMSelectors();

    document
      .querySelector(DOMSelectors.addBtn)
      .addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });
  };

  const ctrlAddItem = function() {
    // Get field input data
    const input = uiCtrl.getInput();
    console.log(input);
    // Add item to the budgetCtrl
    // Add item to the UI
    // Calculate budget
    // Display budget on the
  };

  return {
    init: function() {
      console.log('App started');
      setupEventListeners();
    },
  };
})(budgetController, uiController);

appController.init();
