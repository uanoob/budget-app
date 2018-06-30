// Budget Controller
const budgetController = (function() {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };
  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };
  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };
  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  const calculateTotal = function(type) {
    let sum = 0;
    data.allItems[type].forEach(function(item) {
      sum += item.value;
    });
    data.total[type] = sum;
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
    budget: 0,
    percentage: -1,
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
    deleteItem: function(type, id) {
      data.allItems[type].map(function(item, index) {
        if (item.id === id) {
          data.allItems[type].splice(index, 1);
        }
      });
    },
    calculateBudget: function() {
      // Calculate total income and expenses
      calculateTotal('inc');
      calculateTotal('exp');
      // Calculate the budget: income - expenses
      data.budget = data.total.inc - data.total.exp;
      // Calculate the percentage of income that we spend
      if (data.total.inc > 0) {
        data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.total.inc,
        totalExp: data.total.exp,
        percentage: data.percentage,
      };
    },
    calculatePercentages: function() {
      data.allItems.exp.forEach(function(item) {
        item.calcPercentage(data.total.inc);
      });
    },
    getPercentage: function() {
      const allPerc = data.allItems.exp.map(function(item) {
        return item.getPercentage();
      });
      return allPerc;
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
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercentageLabel: '.item__percentage',
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMSelectors.addType).value, //Will be exp or inc
        description: document.querySelector(DOMSelectors.addDescription).value,
        value: parseFloat(document.querySelector(DOMSelectors.addValue).value),
      };
    },
    addListItem: function(item, type) {
      let html, element;
      // Create HTML string  with actual data
      if (type === 'inc') {
        element = DOMSelectors.incomeList;
        html = `
        <div class="item clearfix" id="inc-${item.id}">
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
        <div class="item clearfix" id="exp-${item.id}">
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
    deleteListItem: function(selectorID) {
      document.getElementById(selectorID).remove();
    },
    clearFields: function() {
      const desc = document.querySelector(DOMSelectors.addDescription);
      desc.value = '';
      desc.focus();
      document.querySelector(DOMSelectors.addValue).value = '';
    },
    displayBudget: function(obj) {
      document.querySelector(DOMSelectors.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMSelectors.incomeLabel).textContent =
        obj.totalInc;
      document.querySelector(DOMSelectors.expensesLabel).textContent =
        obj.totalExp;
      if (obj.percentage > 0) {
        document.querySelector(DOMSelectors.percentageLabel).textContent = `${
          obj.percentage
        } %`;
      } else {
        document.querySelector(DOMSelectors.percentageLabel).textContent = '--';
      }
    },
    displayPercentage: function(percentage) {
      const elements = document.querySelectorAll(
        DOMSelectors.expensesPercentageLabel
      );
      elementsArr = Array.from(elements);
      elementsArr.forEach(function(item, index) {
        if (percentage[index] > 0) {
          item.textContent = `${percentage[index]}%`;
        } else {
          item.textContent = '--';
        }
      });
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
    document
      .querySelector(DOMSelectors.container)
      .addEventListener('click', ctrlDeleteItem);
  };

  const updateBudget = function() {
    // Calculate budget
    budgetCtrl.calculateBudget();
    // Get budget
    const budget = budgetCtrl.getBudget();
    // Display budget on the UI
    uiCtrl.displayBudget(budget);
  };

  const updatePercentage = function() {
    // Calculate percentages
    budgetCtrl.calculatePercentages();
    // Get percentage from budget Controller
    const percentage = budgetCtrl.getPercentage();
    // Update UI with new percentage
    uiCtrl.displayPercentage(percentage);
  };

  const ctrlAddItem = function() {
    let input, newItem;
    // Get field input data
    input = uiCtrl.getInput();
    // Verifying input data
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // Add item to the budgetCtrl
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // Add item to the UI
      uiCtrl.addListItem(newItem, input.type);
      // Clear input fields
      uiCtrl.clearFields();
      // Calculate and update budget
      updateBudget();
      // Calculate and update percentage
      updatePercentage();
    }
  };

  const ctrlDeleteItem = function(e) {
    let itemID, splitID, ID, type;
    if (e.target.parentNode.classList.contains('item__delete--btn')) {
      itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
      if (itemID) {
        splitID = itemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]);
        // Delete item from data structure
        budgetCtrl.deleteItem(type, ID);
        // Delete item from UI
        uiCtrl.deleteListItem(itemID);
        // Update and show budget
        updateBudget();
        // Calculate and update percentage
        updatePercentage();
      }
    }
  };

  return {
    init: function() {
      console.log('App started');
      setupEventListeners();
      uiCtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
    },
  };
})(budgetController, uiController);

appController.init();
