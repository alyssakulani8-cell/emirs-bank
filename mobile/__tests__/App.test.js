import { authenticateUser, categorize, getCustomerByAccount, CUSTOMER_DB } from '../src/data/customers';

describe('App data layer', () => {
  it('has 4 customer accounts', () => {
    expect(CUSTOMER_DB.length).toBeGreaterThanOrEqual(4);
  });

  it('authenticates each demo user', () => {
    const users = ['john', 'sarah', 'mike', 'keanu'];
    users.forEach(u => {
      const result = authenticateUser(u, 'password');
      expect(result).toBeNull();
    });
  });

  it('has transactions on customer accounts', () => {
    CUSTOMER_DB.forEach(c => {
      expect(c.accounts.length).toBeGreaterThan(0);
      expect(c.transactions.length).toBeGreaterThan(0);
    });
  });

  it('categorizes various transaction descriptions', () => {
    expect(categorize('Netflix Subscription')).toBe('bills');
    expect(categorize('Spotify Premium')).toBe('bills');
    expect(categorize('Shell Gas Station')).toBe('transport');
    expect(categorize('Target Shopping')).toBe('shopping');
  });
});
