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
  return {
    addItem: function(type, desc, val) {
      let newItem;
      let ID;
      // ID = last ID + 1
      // Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Create new item based on 'exp' or 'inc' type
      if (type === 'exp') {
        newItem = new Expense(ID, desc, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, desc, val);
      }
      data.allItems[type].push(newItem);
      return newItem;
    },
    logData: function() {
      return data;
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
    incomeList: '.income__list',
    expensesList: '.expenses__list',
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMSelectors.addType).value, //Will be exp or inc
        description: document.querySelector(DOMSelectors.addDescription).value,
        value: document.querySelector(DOMSelectors.addValue).value,
      };
    },
    addListItem: function(item, type) {
      let html, element;
      // Create HTML string  with actual data
      if (type === 'inc') {
        element = DOMSelectors.incomeList;
        html = `
        <div class="item clearfix" id="income-${item.id}">
          <div class="item__description">${item.description}</div>
          <div class="right clearfix">
            <div class="item__value">+ ${item.value}</div>
            <div class="item__delete">
                <button class="item__delete--btn">
                    <i class="ion-ios-close-outline"></i>
                </button>
            </div>
          </div>
        </div>
        `;
      } else if (type === 'exp') {
        element = DOMSelectors.expensesList;
        html = `
        <div class="item clearfix" id="expense-${item.id}">
          <div class="item__description">${item.description}</div>
          <div class="right clearfix">
            <div class="item__value">- ${item.value}</div>
            <div class="item__percentage">21%</div>
            <div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
            </div>
          </div>
        </div>
        `;
      }
      // Insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', html);
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
    let input, newItem;
    // Get field input data
    input = uiCtrl.getInput();
    // Add item to the budgetCtrl
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    // Add item to the UI
    uiCtrl.addListItem(newItem, input.type);
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
