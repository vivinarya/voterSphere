const assert = require('assert');
const Chatbot = require('../src/chatbot');

async function runTests() {
  console.log('Running tests for VoterSphere Chatbot...');
  
  const bot = new Chatbot();
  
  // Test Context Selection
  assert.strictEqual(bot.state, 'AWAITING_CONTEXT');
  await bot.handleInput('1');
  assert.strictEqual(bot.userContext, 'first-time');
  assert.strictEqual(bot.state, 'MAIN_MENU');
  
  // Test Main Menu navigation to Registration
  await bot.handleInput('A');
  assert.strictEqual(bot.state, 'VOTER_REGISTRATION');
  
  // Test Registration logic (5-digit)
  let response = await bot.handleInput('12345');
  assert.ok(response.includes('15 days before the election'));
  assert.ok(response.includes('first-time')); // Context specific advice
  assert.strictEqual(bot.state, 'MAIN_MENU'); // Should return to main menu

  // Test invalid registration logic
  await bot.handleInput('A');
  response = await bot.handleInput('abcd'); // invalid postal code
  assert.ok(response.includes('valid 5 or 6-digit'));
  assert.strictEqual(bot.state, 'VOTER_REGISTRATION'); // State unchanged

  // Test Registration logic (6-digit PIN code)
  response = await bot.handleInput('123456');
  assert.ok(response.includes('15 days before the election'));
  assert.strictEqual(bot.state, 'MAIN_MENU'); // Should return to main menu
  
  // Test invalid menu option
  response = await bot.handleInput('X');
  assert.ok(response.includes('Invalid option'));

  // Test 'menu' keyword
  response = await bot.handleInput('menu');
  assert.ok(response.includes('[A] Voter Registration'));
  
  console.log('All tests passed successfully! ✅');
}

runTests();
