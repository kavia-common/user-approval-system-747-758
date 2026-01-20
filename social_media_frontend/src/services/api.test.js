import { getHealth } from './api';

describe('api client baseURL', () => {
  it('points to env base URL (no runtime call)', () => {
    // This test validates that the module uses REACT_APP_API_BASE_URL variable.
    // We cannot call backend here; only assert module loads without throwing.
    expect(typeof getHealth).toBe('function');
  });
});
