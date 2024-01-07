const members = [];
const expenses = [];
let additionalCosts = 0;
let totalAdditionalCosts = 0;

function addMember() {
  const memberName = document.getElementById("member-name").value;
  if (memberName.trim() !== "") {
    members.push({ name: memberName, totalAmount: 0 });
    document.getElementById("members-list").innerHTML = "";
    document.getElementById("member-name").value = "";
    updateMemberList();
  }
}

function addExpense() {
  const selectedMemberIndex =
    document.getElementById("member-dropdown").selectedIndex;
  const expenseAmount = parseFloat(
    document.getElementById("expense-amount").value
  );
  if (selectedMemberIndex !== -1 && !isNaN(expenseAmount)) {
    const selectedMember = members[selectedMemberIndex];
    selectedMember.totalAmount += expenseAmount;
    expenses.push({ member: selectedMember, amount: expenseAmount });
    document.getElementById("expense-amount").value = "";
    updateMemberList();
    calculateExpenseDistribution();
  }
}

function calculateExpenseDistribution() {
  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );
  const totalAmountWithCosts = totalExpenses + additionalCosts;

  // Calculate the total sum of ratios
  const totalRatioSum = members.reduce(
    (sum, member) => sum + member.totalAmount / totalAmountWithCosts,
    0
  );

  members.forEach((member) => {
    const ratio = member.totalAmount / totalAmountWithCosts;
    const extraCosts = additionalCosts * (ratio / totalRatioSum);
    member.totalAmount += extraCosts;
  });

  // Update #extra-costs-display
  const extraCostsDisplay = document.getElementById("extra-costs-display");
  extraCostsDisplay.textContent = `$${totalAdditionalCosts.toFixed(2)}`;
  displayExpenseDistribution();
}

function updateMemberList() {
  const memberDropdown = document.getElementById("member-dropdown");
  memberDropdown.innerHTML = "";
  members.forEach((member) => {
    const option = document.createElement("option");
    option.text = member.name;
    memberDropdown.add(option);
  });

  const membersList = document.getElementById("members-list");
  membersList.innerHTML = "";
  members.forEach((member) => {
    const listItem = document.createElement("div");
    listItem.textContent = `${member.name}: $${member.totalAmount.toFixed(2)}`;
    membersList.appendChild(listItem);
  });
}

function displayExpenseDistribution() {
  const expenseDistributionTable = document.createElement("table");
  expenseDistributionTable.id = "expense-distribution-table";
  expenseDistributionTable.innerHTML = `
        <thead>
            <tr>
                <th>Member</th>
                <th>Total Amount</th>
            </tr>
        </thead>
        <tbody>
            <!-- Expense distribution rows will be added dynamically here -->
        </tbody>
        <tfoot>
            <tr>
                <td>Final Total</td>
                <td id="final-total">---</td>
            </tr>
        </tfoot>
    `;

  const tableBody = expenseDistributionTable.querySelector("tbody");
  members.forEach((member) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${member.name}</td>
            <td>$${member.totalAmount.toFixed(2)}</td>
        `;
    tableBody.appendChild(row);
  });

  const oldTable = document.getElementById("expense-distribution-table");
  if (oldTable) {
    oldTable.parentNode.removeChild(oldTable); // Remove the old table
  }

  document
    .getElementById("expense-distribution")
    .appendChild(expenseDistributionTable);

  // Calculate and display the final total
  const finalTotalCell = document.getElementById("final-total");
  const finalTotal = members.reduce(
    (total, member) => total + member.totalAmount,
    0
  );
  finalTotalCell.textContent = `$${finalTotal.toFixed(2)}`;
}

document.getElementById("extra-costs").addEventListener("input", (event) => {
  additionalCosts = parseFloat(event.target.value);
});

document.getElementById("submit-extra-costs").addEventListener("click", () => {
  if (!isNaN(additionalCosts)) {
    totalAdditionalCosts += additionalCosts;
    calculateExpenseDistribution();
  }
});
