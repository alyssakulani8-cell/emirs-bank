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
      { id: 'kr2', type: 'High-Yield Savings', number: '****8001', balance: 2500000.00 },
    ],
    transactions: [
      { desc: 'The Matrix Resurrections Residual', type: 'credit', amount: 850000.00, date: 'Jun 20, 2026', senderName: 'Warner Bros Studios', senderAccount: 'WB-HOLLYWOOD', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Film Residuals', reference: 'TXN-KR-001', status: 'completed' },
      { desc: 'John Wick 5 Advance Payment', type: 'credit', amount: 2500000.00, date: 'Jun 18, 2026', senderName: 'Lionsgate Films', senderAccount: 'LG-ENT-USA', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Film Advance', reference: 'TXN-KR-002', status: 'completed' },
      { desc: 'Arch Motorcycle - KRGT-1 Custom', type: 'debit', amount: 85000.00, date: 'Jun 15, 2026', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Arch Motorcycle Company', receiverAccount: '****7007', purpose: 'Custom Motorcycle', reference: 'TXN-KR-003', status: 'completed' },
      { desc: 'Transfer to High-Yield Savings', type: 'debit', amount: 200000.00, date: 'Jun 10, 2026', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Keanu Reeves', receiverAccount: '****8001', purpose: 'Savings Allocation', reference: 'TXN-KR-004', status: 'completed' },
      { desc: 'Charity Donation - Stand Up to Cancer', type: 'debit', amount: 500000.00, date: 'Jun 5, 2026', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Stand Up to Cancer', receiverAccount: 'SU2C-ORG', purpose: 'Charitable Donation', reference: 'TXN-KR-005', status: 'completed' },
      { desc: 'Beverly Hills Property Tax', type: 'debit', amount: 45000.00, date: 'Jun 1, 2026', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'LA County Tax Office', receiverAccount: '****4400', purpose: 'Property Tax', reference: 'TXN-KR-006', status: 'completed' },
      { desc: 'BRZRKR #12 Comic Revenue', type: 'credit', amount: 320000.00, date: 'May 25, 2026', senderName: 'BOOM! Studios', senderAccount: 'BOOM-COMICS', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Comic Revenue Share', reference: 'TXN-KR-007', status: 'completed' },
      { desc: 'Book Royalties - Publisher', type: 'credit', amount: 180000.00, date: 'May 15, 2026', senderName: 'Penguin Random House', senderAccount: 'PRH-PUBLISHING', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Book Sales', reference: 'TXN-KR-008', status: 'completed' },
      { desc: 'Four Seasons Maui - Dog Island Retreat', type: 'debit', amount: 12500.00, date: 'May 10, 2026', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Four Seasons Maui', receiverAccount: '****9900', purpose: 'Vacation', reference: 'TXN-KR-009', status: 'completed' },
      { desc: 'Quarterly Dividend - Vanguard Index', type: 'credit', amount: 75000.00, date: 'May 1, 2026', senderName: 'Vanguard Total Market Index', senderAccount: 'VG-INDEX-USA', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Dividend Payout', reference: 'TXN-KR-010', status: 'completed' },
      { desc: 'SAG-AFTRA Residual Payment', type: 'credit', amount: 425000.00, date: 'Apr 20, 2026', senderName: 'SAG-AFTRA', senderAccount: 'SAG-RESIDUALS', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Union Residuals', reference: 'TXN-KR-011', status: 'completed' },
      { desc: 'Malibu Home Renovation', type: 'debit', amount: 275000.00, date: 'Apr 10, 2026', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Coastal Construction Co', receiverAccount: '****8800', purpose: 'Home Renovation', reference: 'TXN-KR-012', status: 'completed' },
      { desc: 'John Wick 4 Residual Payment', type: 'credit', amount: 1200000.00, date: 'Mar 30, 2026', senderName: 'Lionsgate Films', senderAccount: 'LG-ENT-USA', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Film Residuals', reference: 'TXN-KR-013', status: 'completed' },
      { desc: 'Charity - SickKids Foundation', type: 'debit', amount: 350000.00, date: 'Mar 15, 2026', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'SickKids Foundation', receiverAccount: 'SK-CHARITY', purpose: 'Charitable Donation', reference: 'TXN-KR-014', status: 'completed' },
      { desc: 'BRZRKR Netflix Option Payment', type: 'credit', amount: 1800000.00, date: 'Feb 28, 2026', senderName: 'Netflix Studios', senderAccount: 'NFLX-ENT', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Film/TV Rights', reference: 'TXN-KR-015', status: 'completed' },
      { desc: 'Porsche 911 GT3 RS Purchase', type: 'debit', amount: 225000.00, date: 'Feb 14, 2026', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Porsche Beverly Hills', receiverAccount: '****5500', purpose: 'Vehicle Purchase', reference: 'TXN-KR-016', status: 'completed' },
      { desc: 'The Matrix 20th Anniversary Royalties', type: 'credit', amount: 950000.00, date: 'Jan 31, 2026', senderName: 'Warner Bros Studios', senderAccount: 'WB-HOLLYWOOD', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Film Royalties', reference: 'TXN-KR-017', status: 'completed' },
      { desc: 'Transfer to Investment Account', type: 'debit', amount: 500000.00, date: 'Jan 15, 2026', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Keanu Reeves', receiverAccount: '****8002', purpose: 'Investment Transfer', reference: 'TXN-KR-018', status: 'completed' },
      { desc: 'Year-End Tax Payment - IRS', type: 'debit', amount: 3200000.00, date: 'Dec 30, 2025', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'IRS', receiverAccount: 'IRS-TAX', purpose: 'Estimated Tax Payment', reference: 'TXN-KR-019', status: 'completed' },
      { desc: 'Christmas Charity - Children\'s Hospital LA', type: 'debit', amount: 600000.00, date: 'Dec 20, 2025', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Children\'s Hospital LA', receiverAccount: 'CHLA-ORG', purpose: 'Charitable Donation', reference: 'TXN-KR-020', status: 'completed' },
      { desc: 'Constantine 2 Development Fee', type: 'credit', amount: 750000.00, date: 'Dec 5, 2025', senderName: 'DC Entertainment', senderAccount: 'DC-FILMS', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Film Development', reference: 'TXN-KR-021', status: 'completed' },
      { desc: 'Man of Tai Chi DVD/Streaming Revenue', type: 'credit', amount: 120000.00, date: 'Nov 15, 2025', senderName: 'Universal Pictures', senderAccount: 'UNIVERSAL-DIST', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Distribution Revenue', reference: 'TXN-KR-022', status: 'completed' },
      { desc: 'Arch Motorcycle - Factory Expansion', type: 'debit', amount: 450000.00, date: 'Nov 1, 2025', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Arch Motorcycle Co', receiverAccount: 'ARCH-FAC', purpose: 'Business Investment', reference: 'TXN-KR-023', status: 'completed' },
      { desc: 'BRZRKR Annual Licensing Revenue', type: 'credit', amount: 560000.00, date: 'Oct 15, 2025', senderName: 'BOOM! Studios', senderAccount: 'BOOM-LICENSING', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Licensing Revenue', reference: 'TXN-KR-024', status: 'completed' },
      { desc: 'Property Insurance Premium', type: 'debit', amount: 28000.00, date: 'Oct 1, 2025', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Chubb Insurance', receiverAccount: 'CHUBB-INS', purpose: 'Insurance Premium', reference: 'TXN-KR-025', status: 'completed' },
      { desc: 'Speed 30th Anniversary Syndication', type: 'credit', amount: 380000.00, date: 'Sep 20, 2025', senderName: '20th Century Studios', senderAccount: 'FOX-SYNDICATION', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Syndication Royalties', reference: 'TXN-KR-026', status: 'completed' },
      { desc: 'Canadian Real Estate Investment', type: 'debit', amount: 1500000.00, date: 'Sep 5, 2025', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Toronto Property Trust', receiverAccount: 'TOR-PROP', purpose: 'Real Estate Investment', reference: 'TXN-KR-027', status: 'completed' },
      { desc: 'Point Break Residual Check', type: 'credit', amount: 95000.00, date: 'Aug 20, 2025', senderName: '20th Century Studios', senderAccount: 'FOX-RESIDUALS', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Film Residuals', reference: 'TXN-KR-028', status: 'completed' },
      { desc: 'Malibu Property Staff Payroll', type: 'debit', amount: 32000.00, date: 'Aug 1, 2025', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Estate Management Services', receiverAccount: 'EMS-PAYROLL', purpose: 'Staff Payroll', reference: 'TXN-KR-029', status: 'completed' },
      { desc: 'Toyota Land Cruiser Donation', type: 'debit', amount: 65000.00, date: 'Jul 15, 2025', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'LA Food Bank', receiverAccount: 'LAFB-CHARITY', purpose: 'Vehicle Donation', reference: 'TXN-KR-030', status: 'completed' },
      { desc: 'Bill & Ted Face the Music Royalties', type: 'credit', amount: 210000.00, date: 'Jul 1, 2025', senderName: 'Orion Pictures', senderAccount: 'ORION-ENT', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Film Royalties', reference: 'TXN-KR-031', status: 'completed' },
      { desc: 'Annual Portfolio Rebalance', type: 'debit', amount: 750000.00, date: 'Jun 10, 2025', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Fidelity Investments', receiverAccount: 'FID-BROKERAGE', purpose: 'Investment Allocation', reference: 'TXN-KR-032', status: 'completed' },
      { desc: 'John Wick Chapter 4 Backend', type: 'credit', amount: 4500000.00, date: 'May 15, 2025', senderName: 'Lionsgate Films', senderAccount: 'LG-BACKEND', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Backend Compensation', reference: 'TXN-KR-033', status: 'completed' },
      { desc: 'Gemini Role 30th Anniversary Residual', type: 'credit', amount: 45000.00, date: 'Apr 20, 2025', senderName: 'Paramount Pictures', senderAccount: 'PAR-RESIDUALS', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Film Residual', reference: 'TXN-KR-034', status: 'completed' },
      { desc: 'Venice Italy Apartment Purchase', type: 'debit', amount: 2100000.00, date: 'Apr 1, 2025', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Venice Real Estate SRL', receiverAccount: 'VRE-ITALY', purpose: 'International Property', reference: 'TXN-KR-035', status: 'completed' },
      { desc: 'BRZRKR #6-#12 Production Bonus', type: 'credit', amount: 890000.00, date: 'Mar 10, 2025', senderName: 'BOOM! Studios', senderAccount: 'BOOM-PRODUCTION', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Production Bonus', reference: 'TXN-KR-036', status: 'completed' },
      { desc: 'Los Angeles Gala for Cancer Research', type: 'debit', amount: 100000.00, date: 'Feb 20, 2025', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'City of Hope', receiverAccount: 'COH-GALA', purpose: 'Charity Gala Sponsorship', reference: 'TXN-KR-037', status: 'completed' },
      { desc: 'The Devil\'s Advocate Residual', type: 'credit', amount: 165000.00, date: 'Feb 1, 2025', senderName: 'Warner Bros Studios', senderAccount: 'WB-CLASSICS', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Film Residual', reference: 'TXN-KR-038', status: 'completed' },
      { desc: 'Canadian Wilderness Conservation Donation', type: 'debit', amount: 200000.00, date: 'Jan 10, 2025', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Nature Conservancy Canada', receiverAccount: 'NCC-CA', purpose: 'Environmental Donation', reference: 'TXN-KR-039', status: 'completed' },
      { desc: 'The Matrix 25th Anniversary Profit Share', type: 'credit', amount: 2100000.00, date: 'Dec 25, 2024', senderName: 'Warner Bros Studios', senderAccount: 'WB-PROFIT-SHARE', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Profit Participation', reference: 'TXN-KR-040', status: 'completed' },
      { desc: 'Keanu\'s Private Art Collection Purchase', type: 'debit', amount: 120000.00, date: 'Nov 20, 2024', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Gagosian Gallery', receiverAccount: 'GAGOSIAN-NY', purpose: 'Art Acquisition', reference: 'TXN-KR-041', status: 'completed' },
      { desc: 'Toyota Land Cruiser Maintenance', type: 'debit', amount: 3200.00, date: 'Nov 5, 2024', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Toyota Santa Monica', receiverAccount: 'T-SM-SERVICE', purpose: 'Vehicle Service', reference: 'TXN-KR-042', status: 'completed' },
      { desc: 'The Matrix Resurrections Streaming Bonus', type: 'credit', amount: 680000.00, date: 'Oct 15, 2024', senderName: 'HBO Max', senderAccount: 'HBO-STREAMING', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Streaming Revenue', reference: 'TXN-KR-043', status: 'completed' },
      { desc: 'Shakespeare in the Park Donation', type: 'debit', amount: 50000.00, date: 'Oct 1, 2024', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Public Theater NY', receiverAccount: 'PUBLIC-NY', purpose: 'Arts Donation', reference: 'TXN-KR-044', status: 'completed' },
      { desc: 'Siberian Husky Rescue Donation', type: 'debit', amount: 25000.00, date: 'Sep 15, 2024', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'No-Kill LA Shelter', receiverAccount: 'NKLA-RESCUE', purpose: 'Animal Rescue', reference: 'TXN-KR-045', status: 'completed' },
      { desc: 'Bram Stoker\'s Dracula Residual', type: 'credit', amount: 85000.00, date: 'Sep 1, 2024', senderName: 'Columbia Pictures', senderAccount: 'SONY-RESIDUALS', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Film Residual', reference: 'TXN-KR-046', status: 'completed' },
      { desc: 'Speed 4K Remaster Royalty', type: 'credit', amount: 120000.00, date: 'Aug 10, 2024', senderName: 'Disney/Fox', senderAccount: 'DISNEY-REMASTER', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Remaster Royalty', reference: 'TXN-KR-047', status: 'completed' },
      { desc: 'Sun Valley Idaho Cabin Purchase', type: 'debit', amount: 3200000.00, date: 'Jul 25, 2024', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Sun Valley Properties', receiverAccount: 'SV-REALTY', purpose: 'Vacation Property', reference: 'TXN-KR-048', status: 'completed' },
      { desc: 'BRZRKR #1 Comic Launch Revenue', type: 'credit', amount: 1500000.00, date: 'Jul 1, 2024', senderName: 'BOOM! Studios', senderAccount: 'BOOM-LAUNCH', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Comic Launch Revenue', reference: 'TXN-KR-049', status: 'completed' },
      { desc: 'Dog Park Donation - Los Angeles', type: 'debit', amount: 75000.00, date: 'Jun 15, 2024', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'LA Parks Foundation', receiverAccount: 'LAPK-FOUND', purpose: 'Community Donation', reference: 'TXN-KR-050', status: 'completed' },
      { desc: 'Toyota Land Cruiser Purchase', type: 'debit', amount: 85000.00, date: 'Mar 10, 2024', senderName: 'Keanu Reeves', senderAccount: '****8000', receiverName: 'Toyota of Hollywood', receiverAccount: 'TOY-HOLLY', purpose: 'Vehicle Purchase', reference: 'TXN-KR-051', status: 'completed' },
      { desc: 'John Wick 4 Global Box Office Bonus', type: 'credit', amount: 5800000.00, date: 'Feb 28, 2024', senderName: 'Lionsgate Films', senderAccount: 'LG-BOXOFFICE', receiverName: 'Keanu Reeves', receiverAccount: '****8000', purpose: 'Box Office Bonus', reference: 'TXN-KR-052', status: 'completed' },
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
