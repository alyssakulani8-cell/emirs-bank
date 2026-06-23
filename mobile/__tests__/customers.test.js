import { categorize, authenticateUser, getCustomerByAccount } from '../src/data/customers';

describe('categorize', () => {
  it('returns "food" for restaurant descriptions', () => {
    expect(categorize('Whole Foods Market')).toBe('food');
    expect(categorize('Campus Dining')).toBe('food');
  });

  it('returns "shopping" for Amazon', () => {
    expect(categorize('Amazon.com')).toBe('shopping');
  });

  it('returns "other" for unknown', () => {
    expect(categorize('Random Expense')).toBe('other');
  });
});

describe('authenticateUser', () => {
  it('returns customer for valid john credentials', () => {
    const result = authenticateUser('john', 'JohnSmith123!');
    expect(result).toBeTruthy();
    expect(result.customer.name).toBe('John Smith');
  });

  it('returns null for invalid password', () => {
    expect(authenticateUser('john', 'wrong')).toBeNull();
  });

  it('returns null for unknown user', () => {
    expect(authenticateUser('nobody', 'pass')).toBeNull();
  });
});

describe('getCustomerByAccount', () => {
  it('finds John Smith by account', () => {
    const customer = getCustomerByAccount('****4829');
    expect(customer).toBeTruthy();
    expect(customer.name).toBe('John Smith');
  });

  it('returns null for missing account', () => {
    expect(getCustomerByAccount('****0000')).toBeNull();
  });
});
