<body onload="showExpenses()">
 <div class="container">
  <div class="row">
   <div class="col-md-8 mx-auto">
    <h1>Expense Tracker</h1>
    <form onsubmit="return addExpense()">
     <input type="hidden" id="editIndex">
     <div class="form-group">
      <label for="date">Date:</label>
      <input type="date" id="date" class="form-control" required>
     </div>
     <div class="form-group">
      <label for="category">Category:</label>
      <input type="text" id="category" class="form-control" required>
     </div>
     <div class="form-group">
      <label for="amount">Amount:</label>
      <input type="number" id="amount" class="form-control" required>
     </div>
     <button type="submit" id="addButton" class="btn btn-primary">Add Expense</button>
    </form>
    <br>
    <table class="table table-striped table-bordered" id="expenseTable">
     <thead>
      <tr>
       <th>Date</th>
       <th>Category</th>
       <th>Amount</th>
       <th>Actions</th>
      </tr>
     </thead>
     <tbody></tbody>
    </table>
   </div>
  </div>
 </div>
