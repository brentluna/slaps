const { game } = require('./../index');
const applicants = require('./../../applicants');

describe('Game', () => {
  it('it works', () => {
    const gameApplicants = applicants.map(app => ({ ...app }));
    const result = game(gameApplicants);
    const winner = result[0].Name;
    expect(winner).toBe('Shamu');
  });
});
