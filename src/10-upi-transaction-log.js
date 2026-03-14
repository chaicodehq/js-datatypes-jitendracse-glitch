/**
 * 💸 UPI Transaction Log Analyzer
 *
 * Aaj kal sab UPI pe chalta hai! Tujhe ek month ke transactions ka log
 * milega, aur tujhe pura analysis karna hai - kitna aaya, kitna gaya,
 * kiski saath zyada transactions hue, etc.
 *
 * Rules:
 *   - transactions is array of objects:
 *     [{ id: "TXN001", type: "credit"/"debit", amount: 500,
 *        to: "Rahul", category: "food", date: "2025-01-15" }, ...]
 *   - Skip transactions where amount is not a positive number
 *   - Skip transactions where type is not "credit" or "debit"
 *   - Calculate (on valid transactions only):
 *     - totalCredit: sum of all "credit" type amounts
 *     - totalDebit: sum of all "debit" type amounts
 *     - netBalance: totalCredit - totalDebit
 *     - transactionCount: total number of valid transactions
 *     - avgTransaction: Math.round(sum of all valid amounts / transactionCount)
 *     - highestTransaction: the full transaction object with highest amount
 *     - categoryBreakdown: object with category as key and total amount as value
 *       e.g., { food: 1500, travel: 800 } (include both credit and debit)
 *     - frequentContact: the "to" field value that appears most often
 *       (if tie, return whichever appears first)
 *     - allAbove100: boolean, true if every valid transaction amount > 100 (use every)
 *     - hasLargeTransaction: boolean, true if some valid amount >= 5000 (use some)
 *   - Hint: Use filter(), reduce(), sort(), find(), every(), some(),
 *     Object.entries(), Math.round(), typeof
 *
 * Validation:
 *   - Agar transactions array nahi hai ya empty hai, return null
 *   - Agar after filtering invalid transactions, koi valid nahi bacha, return null
 *
 * @param {Array<{ id: string, type: string, amount: number, to: string, category: string, date: string }>} transactions
 * @returns {{ totalCredit: number, totalDebit: number, netBalance: number, transactionCount: number, avgTransaction: number, highestTransaction: object, categoryBreakdown: object, frequentContact: string, allAbove100: boolean, hasLargeTransaction: boolean } | null}
 *
 * @example
 *   analyzeUPITransactions([
 *     { id: "T1", type: "credit", amount: 5000, to: "Salary", category: "income", date: "2025-01-01" },
 *     { id: "T2", type: "debit", amount: 200, to: "Swiggy", category: "food", date: "2025-01-02" },
 *     { id: "T3", type: "debit", amount: 100, to: "Swiggy", category: "food", date: "2025-01-03" }
 *   ])
 *   // => { totalCredit: 5000, totalDebit: 300, netBalance: 4700,
 *   //      transactionCount: 3, avgTransaction: 1767,
 *   //      highestTransaction: { id: "T1", ... },
 *   //      categoryBreakdown: { income: 5000, food: 300 },
 *   //      frequentContact: "Swiggy", allAbove100: false, hasLargeTransaction: true }
 */
export function analyzeUPITransactions(transactions) {
  // Validate input
  if (!Array.isArray(transactions) || transactions.length === 0) return null;
  
  // Filter valid transactions
  const validTransactions = transactions.filter(t => 
    typeof t.amount === 'number' && t.amount > 0 &&
    (t.type === 'credit' || t.type === 'debit')
  );
  
  if (validTransactions.length === 0) return null;
  
  // Calculate credit and debit
  const totalCredit = validTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalDebit = validTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netBalance = totalCredit - totalDebit;
  
  // Calculate averages
  const allAmounts = validTransactions.map(t => t.amount);
  const totalAmount = allAmounts.reduce((sum, a) => sum + a, 0);
  const avgTransaction = Math.round(totalAmount / validTransactions.length);
  
  // Find highest transaction
  const highestTransaction = validTransactions.reduce((max, t) => 
    t.amount > max.amount ? t : max
  );
  
  // Category breakdown
  const categoryBreakdown = validTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});
  
  // Find frequent contact
  const contactCounts = validTransactions.reduce((acc, t) => {
    acc[t.to] = (acc[t.to] || 0) + 1;
    return acc;
  }, {});
  
  let frequentContact = '';
  let maxCount = 0;
  for (const [contact, count] of Object.entries(contactCounts)) {
    if (count > maxCount) {
      maxCount = count;
      frequentContact = contact;
    }
  }
  
  // Check all above 100
  const allAbove100 = validTransactions.every(t => t.amount > 100);
  
  // Check if any large transaction
  const hasLargeTransaction = validTransactions.some(t => t.amount >= 5000);
  
  return {
    totalCredit: totalCredit,
    totalDebit: totalDebit,
    netBalance: netBalance,
    transactionCount: validTransactions.length,
    avgTransaction: avgTransaction,
    highestTransaction: highestTransaction,
    categoryBreakdown: categoryBreakdown,
    frequentContact: frequentContact,
    allAbove100: allAbove100,
    hasLargeTransaction: hasLargeTransaction
  };
}
