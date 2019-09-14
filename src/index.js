const applicants = require('./../applicants');

const game = applicants => {
  applicants.forEach((appA, idx1) => {
    applicants.forEach((appB, idx2) => {
      if (idx1 !== idx2) {
        const matchWinner = match(appA, appB);
        applicants.forEach(applicant => {
          if (applicant.Name === matchWinner.Name) applicant.Wins++;
        });
      }
    });
  });
  return gameOver(applicants);
};

const round = (fighterA, fighterB, roundNumber) => {
  console.log(`***Round ${roundNumber}***`);
  let currentAttacker = determineFirstAttacker(fighterA, fighterB);
  while (continueFighting(fighterA, fighterB)) {
    const nextAttacker = swapCurrentAttacker(
      [fighterA, fighterB],
      currentAttacker
    );
    handleTurn(currentAttacker, nextAttacker);
    currentAttacker = nextAttacker;
  }
};

const match = (fighterA, fighterB) => {
  console.log(`---Match: ${fighterA.Name} vs ${fighterB.Name}---`);
  const freshFighterA = { ...fighterA };
  const freshFighterB = { ...fighterB };
  let roundNumber = 1;
  while (healthLeft(freshFighterA, freshFighterB)) {
    round(freshFighterA, freshFighterB, roundNumber);
    roundNumber++;
    freshFighterA.Attacks = fighterA.Attacks;
    freshFighterB.Attacks = fighterB.Attacks;
  }
  return matchFinished(freshFighterA, freshFighterB);
};

const handleAttack = (attacker, attacked) => {
  const randomPercent = Math.floor(Math.random() * 100);
  const isCriticalHit = attacker.Critical >= randomPercent;
  const initialHealth = attacked.Health;
  const damageGiven = isCriticalHit ? attacker.Damage * 2 : attacker.Damage;
  attacked.Health -= damageGiven;
  attacker.Attacks -= 1;
  console.log(
    `${attacker.Name} hits ${
      attacked.Name
    } for ${damageGiven} (${initialHealth}->${attacked.Health}) ${
      isCriticalHit ? 'Critical' : ''
    }`
  );
};

const handleTurn = (attacker, attacked) => {
  const attackerHasAttackLeft = attacker.Attacks > 0;
  if (attackerHasAttackLeft) {
    if (wasDodged(attacked)) return;
    handleAttack(attacker, attacked);
  }
};
const matchFinished = (fighterA, fighterB) => {
  const winner = fighterA.Health > fighterB.Health ? fighterA : fighterB;
  console.log(`${winner.Name} Wins!`);
  return winner;
};

const gameOver = applicants => {
  const applicantsOrderedByWins = applicants.sort((a, b) =>
    Math.sign(b.Wins - a.Wins)
  );

  const winsPerApplicant = applicantsOrderedByWins.reduce(
    (results, applicant) => {
      results[applicant.Name] = applicant.Wins;
      return results;
    },
    {}
  );
  console.log(winsPerApplicant);
  return applicantsOrderedByWins;
};

const wasDodged = attacked => {
  const dodgeChance = attacked.Dodge;
  const randomPercent = Math.floor(Math.random() * 100);
  const wasDodged = dodgeChance >= randomPercent;
  wasDodged && console.log(`${attacked.Name} succesfully dodged the attack`);
  return wasDodged;
};
const determineFirstAttacker = (fighterA, fighterB) => {
  const totalInitiative = fighterA.Initiative + fighterB.Initiative;
  const [fighterWithGreaterChance, fighterWithSmallerChance] =
    fighterA.Initiative > fighterB.Initiative
      ? [fighterA, fighterB]
      : [fighterB, fighterA];
  const randomNumber = Math.floor(Math.random() * totalInitiative);
  return randomNumber <= fighterWithGreaterChance.Initiative
    ? fighterWithGreaterChance
    : fighterWithSmallerChance;
};

const attacksLeft = (fighterA, fighterB) => {
  return fighterA.Attacks > 0 || fighterB.Attacks > 0;
};

const healthLeft = (fighterA, fighterB) => {
  return fighterA.Health > 0 && fighterB.Health > 0;
};

const continueFighting = (fighterA, fighterB) => {
  return healthLeft(fighterA, fighterB) && attacksLeft(fighterA, fighterB);
};

const swapCurrentAttacker = (fighters, currentAttacker) => {
  return fighters.find(fighter => fighter.Name !== currentAttacker.Name);
};

// run game
const gameApplicants = applicants.map(app => ({ ...app }));
game(gameApplicants);

module.exports = { round, match, game };
