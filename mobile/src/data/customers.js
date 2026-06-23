export const CUSTOMER_DB = [
  {
    account: '****4829', ssn: '1234', dob: '1985-06-15', email: 'john@email.com',
    name: 'John Smith', initials: 'JS',
    accounts: [
      { id: 'a1', type: 'Premium Checking', number: '****4829', balance: 12480.50 },
      { id: 'a2', type: 'High-Yield Savings', number: '****2190', balance: 45200.00 },
      { id: 'a3', type: 'Platinum Credit Card', number: '****7712', balance: -2340.00 },
    ],
    transactions: [
      { desc: 'Salary Deposit', type: 'credit', amount: 5200.00, date: 'Today', senderName: 'Ameris Global Payroll', senderAccount: 'AMERIS-PAYROLL', receiverName: 'John Smith', receiverAccount: '****4829', purpose: 'Monthly Salary', reference: 'TXN-A1B2C3', status: 'completed' },
      { desc: 'Whole Foods Market', type: 'debit', amount: 87.43, date: 'Today', senderName: 'John Smith', senderAccount: '****4829', receiverName: 'Whole Foods Market', receiverAccount: '****7001', purpose: 'Grocery Purchase', reference: 'TXN-D4E5F6', status: 'completed' },
      { desc: 'Transfer to Savings', type: 'debit', amount: 500.00, date: 'Yesterday', senderName: 'John Smith', senderAccount: '****4829', receiverName: 'John Smith', receiverAccount: '****2190', purpose: 'Savings Transfer', reference: 'TXN-G7H8I9', status: 'completed' },
      { desc: 'Amazon.com', type: 'debit', amount: 129.99, date: 'Yesterday', senderName: 'John Smith', senderAccount: '****4829', receiverName: 'Amazon.com', receiverAccount: 'AMZ-US', purpose: 'Online Shopping', reference: 'TXN-J0K1L2', status: 'completed' },
      { desc: 'Dividend Payment', type: 'credit', amount: 34.50, date: '2 days ago', senderName: 'Vanguard Investments', senderAccount: 'VG-123456', receiverName: 'John Smith', receiverAccount: '****4829', purpose: 'Quarterly Dividend', reference: 'TXN-M3N4O5', status: 'completed' },
      { desc: 'Electric Bill', type: 'debit', amount: 142.00, date: '2 days ago', senderName: 'John Smith', senderAccount: '****4829', receiverName: 'Georgia Power Co', receiverAccount: '****5502', purpose: 'Monthly Electric Bill', reference: 'TXN-P6Q7R8', status: 'completed' },
    ],
  },
  {
    account: '****6678', ssn: '5678', dob: '1990-11-22', email: 'sarah@email.com',
    name: 'Sarah Johnson', initials: 'SJ',
    accounts: [
      { id: 'b1', type: 'Premium Savings', number: '****6678', balance: 89200.75 },
      { id: 'b2', type: 'Basic Checking', number: '****3345', balance: 3250.00 },
    ],
    transactions: [
      { desc: 'Paycheck Deposit', type: 'credit', amount: 3800.00, date: 'Today', senderName: 'Acme Corp Payroll', senderAccount: 'ACME-PR', receiverName: 'Sarah Johnson', receiverAccount: '****6678', purpose: 'Monthly Salary', reference: 'TXN-B2C3D4', status: 'completed' },
      { desc: 'Target', type: 'debit', amount: 156.32, date: 'Today', senderName: 'Sarah Johnson', senderAccount: '****6678', receiverName: 'Target Stores', receiverAccount: '****4411', purpose: 'Retail Purchase', reference: 'TXN-E5F6G7', status: 'completed' },
      { desc: 'Auto Transfer to Savings', type: 'debit', amount: 800.00, date: 'Yesterday', senderName: 'Sarah Johnson', senderAccount: '****6678', receiverName: 'Sarah Johnson', receiverAccount: '****3345', purpose: 'Auto Savings Transfer', reference: 'TXN-H8I9J0', status: 'completed' },
      { desc: 'Netflix', type: 'debit', amount: 15.99, date: 'Yesterday', senderName: 'Sarah Johnson', senderAccount: '****6678', receiverName: 'Netflix Inc', receiverAccount: 'NFLX-USA', purpose: 'Monthly Subscription', reference: 'TXN-K1L2M3', status: 'completed' },
      { desc: 'Shell Gas', type: 'debit', amount: 42.50, date: '3 days ago', senderName: 'Sarah Johnson', senderAccount: '****6678', receiverName: 'Shell Oil Co', receiverAccount: '****8807', purpose: 'Fuel Purchase', reference: 'TXN-N4O5P6', status: 'completed' },
    ],
  },
  {
    account: '****7231', ssn: '9012', dob: '2000-03-08', email: 'mike@email.com',
    name: 'Michael Chen', initials: 'MC',
    accounts: [
      { id: 'c1', type: 'Basic Checking', number: '****7231', balance: 8750.00 },
      { id: 'c2', type: 'Student Banking', number: '****8902', balance: 2340.00 },
    ],
    transactions: [
      { desc: 'Part-time Job Deposit', type: 'credit', amount: 1200.00, date: 'Today', senderName: 'University of Tech', senderAccount: 'UOT-PAYROLL', receiverName: 'Michael Chen', receiverAccount: '****7231', purpose: 'Student Employment', reference: 'TXN-Q7R8S9', status: 'completed' },
      { desc: 'Campus Dining', type: 'debit', amount: 12.50, date: 'Today', senderName: 'Michael Chen', senderAccount: '****7231', receiverName: 'UOT Dining Services', receiverAccount: '****2204', purpose: 'Meal Purchase', reference: 'TXN-T0U1V2', status: 'completed' },
      { desc: 'Textbook Purchase', type: 'debit', amount: 89.99, date: 'Yesterday', senderName: 'Michael Chen', senderAccount: '****7231', receiverName: 'Campus Bookstore', receiverAccount: '****6619', purpose: 'Course Materials', reference: 'TXN-W3X4Y5', status: 'completed' },
      { desc: 'Transfer to Savings', type: 'debit', amount: 200.00, date: 'Yesterday', senderName: 'Michael Chen', senderAccount: '****7231', receiverName: 'Michael Chen', receiverAccount: '****8902', purpose: 'Weekly Savings Transfer', reference: 'TXN-Z6A7B8', status: 'completed' },
      { desc: 'Spotify', type: 'debit', amount: 9.99, date: '3 days ago', senderName: 'Michael Chen', senderAccount: '****7231', receiverName: 'Spotify AB', receiverAccount: 'SPOT-SE', purpose: 'Music Subscription', reference: 'TXN-C9D0E1', status: 'completed' },
    ],
  },
  {
    account: '****8000', ssn: '8000', dob: '1964-09-02', email: 'keanureeeves@gmail.com',
    name: 'Keanu Reeves', initials: 'KR',
    accounts: [
      { id: 'kr1', type: 'Premium Checking', number: '****8000', balance: 800000.00 },
      { id: 'kr2', type: 'High-Yield Savings', number: '****8001', balance: 250000.00 },
    ],
    transactions: [
      { desc: 'The Matrix Residual Payment', type: 'credit', amount: 1250000.00, date: 'Today', senderName: 'Warner Bros Studios', senderAccount: 'WB-HOLLYWOOD', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Film Royalties', reference: 'TXN-KR-001', status: 'completed' },
      { desc: 'John Wick 5 Advance', type: 'credit', amount: 2500000.00, date: 'Yesterday', senderName: 'Lionsgate Films', senderAccount: 'LG-ENT-USA', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Film Advance Payment', reference: 'TXN-KR-002', status: 'completed' },
      { desc: 'Motorcycle Collection Purchase', type: 'debit', amount: 85000.00, date: 'Yesterday', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Arch Motorcycle Company', receiverAccount: '****7007', purpose: 'Custom Arch KRGT-1', reference: 'TXN-KR-003', status: 'completed' },
      { desc: 'Transfer to Savings', type: 'debit', amount: 100000.00, date: '2 days ago', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Keanu Reeves', receiverAccount: '****8001', purpose: 'Savings Allocation', reference: 'TXN-KR-004', status: 'completed' },
      { desc: 'Charity Donation - Stand Up to Cancer', type: 'debit', amount: 500000.00, date: '3 days ago', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Stand Up to Cancer', receiverAccount: 'SU2C-ORG', purpose: 'Charitable Donation', reference: 'TXN-KR-005', status: 'completed' },
      { desc: 'Investment Dividend', type: 'credit', amount: 75000.00, date: '1 week ago', senderName: 'Vanguard Total Market Index', senderAccount: 'VG-INDEX-USA', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Quarterly Dividend Payout', reference: 'TXN-KR-010', status: 'completed' },
    ],
  },
];

export const SEED_USERS = {
  'keanu': { password: 'KeanuReeves123!', account: '****8000', transferPin: '8000' },
  'john': { password: 'JohnSmith123!', account: '****4829', transferPin: '1234' },
  'sarah': { password: 'SarahJ123!', account: '****6678', transferPin: '5678' },
  'mike': { password: 'MichaelC123!', account: '****7231', transferPin: '9012' },
};

export const CATEGORIES = {
  'food': ['Whole Foods', 'Starbucks', 'Coffee', 'Restaurant', 'Dining', 'Campus Dining', 'Groceries'],
  'transport': ['Shell', 'Gas', 'Uber', 'Lyft', 'Transport'],
  'bills': ['Electric', 'Water', 'Internet', 'Phone', 'Netflix', 'Spotify', 'Insurance'],
  'shopping': ['Amazon', 'Target', 'Walmart', 'Shopping', 'Textbook'],
};

export function categorize(desc) {
  for (const cat in CATEGORIES) {
    if (CATEGORIES[cat].some(k => desc.includes(k))) return cat;
  }
  return 'other';
}

export function getCustomerByAccount(account) {
  return CUSTOMER_DB.find(c => c.account === account) || null;
}

export function verifyCustomer(account, dob, email) {
  return CUSTOMER_DB.find(c =>
    c.account === account && c.dob === dob && c.email.toLowerCase() === email.toLowerCase()
  ) || null;
}

export function authenticateUser(username, password) {
  const user = SEED_USERS[username.toLowerCase()];
  if (user && user.password === password) {
    const customer = getCustomerByAccount(user.account);
    return customer ? { user, customer } : null;
  }
  return null;
}
