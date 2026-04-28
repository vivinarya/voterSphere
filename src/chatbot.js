const calendarService = require('./services/calendarService');
const mapsService = require('./services/mapsService');
const searchService = require('./services/searchService');

class Chatbot {
  constructor() {
    this.state = 'AWAITING_CONTEXT';
    this.userContext = null; // 'first-time', 'absentee', 'student'
  }

  async handleInput(input) {
    switch (this.state) {
      case 'AWAITING_CONTEXT':
        return this.handleContextSelection(input);
      case 'MAIN_MENU':
        return await this.handleMainMenu(input);
      case 'VOTER_REGISTRATION':
        return this.handleRegistration(input);
      case 'TIMELINE':
        return this.handleTimeline(input);
      case 'PROCESS':
        return this.handleProcess(input);
      case 'FIND_POLLING_STATION':
        return await this.handlePollingStation(input);
      default:
        this.state = 'MAIN_MENU';
        return 'I did not understand that. Please type "menu" to return to the main menu.';
    }
  }

  handleContextSelection(input) {
    if (['1', 'first', 'first-time'].includes(input)) {
      this.userContext = 'first-time';
    } else if (['2', 'absentee'].includes(input)) {
      this.userContext = 'absentee';
    } else if (['3', 'student'].includes(input)) {
      this.userContext = 'student';
    } else {
      return 'Please reply with 1, 2, or 3.';
    }
    
    this.state = 'MAIN_MENU';
    return `Got it! You are a ${this.userContext} voter. How can I help you today?
Options:
[A] Voter Registration Help
[B] Election Timeline & Dates
[C] How a Vote is Counted
[D] Find Polling Station
[E] Add Election Deadlines to Calendar
(Type A, B, C, D, or E)`;
  }

  async handleMainMenu(input) {
    const choice = input.trim().toUpperCase();
    
    if (choice === 'MENU') {
      return `Options:\n[A] Voter Registration Help\n[B] Election Timeline & Dates\n[C] How a Vote is Counted\n[D] Find Polling Station\n[E] Add Election Deadlines to Calendar\n(Type A, B, C, D, or E)`;
    }

    switch (choice) {
      case 'A':
        this.state = 'VOTER_REGISTRATION';
        return `Voter Registration Help: Please enter your 5-digit ZIP code or 6-digit PIN code to find local rules.`;
      case 'B':
        const dates = await searchService.getUpcomingDates();
        return `Election Timeline:\n${dates}\n\n(Type 'menu' to see options again)`;
      case 'C':
        return `How a Vote is Counted:\n1. Verification: Your identity and signature are verified.\n2. Scanning: Paper ballots are securely scanned.\n3. Tabulation: Results are aggregated securely offline.\n4. Auditing: Random batches are hand-counted to verify machine accuracy.\n\n(Type 'menu' to see options again)`;
      case 'D':
        this.state = 'FIND_POLLING_STATION';
        return `Find Polling Station: Please enter your ZIP/PIN code to search for nearby stations.`;
      case 'E':
        return `Calendar Integration:\n${calendarService.addToCalendar('Election Day')}\n\n(Type 'menu' to see options again)`;
      default:
        return 'Invalid option. Please choose A, B, C, D, or E. (Type "menu" to see options again)';
    }
  }

  async handlePollingStation(input) {
    const code = input.trim();
    if (/^\d{5,6}$/.test(code)) {
        this.state = 'MAIN_MENU';
        const result = await mapsService.findNearestPollingStation(code);
        return `Find Polling Station:\n${result}\n\n(Type 'menu' to see options again)`;
    } else {
        return 'Please enter a valid 5 or 6-digit ZIP/PIN code.';
    }
  }

  handleRegistration(input) {
    // 5-digit (US) or 6-digit (India) postal code validation
    const code = input.trim();
    if (/^\d{5,6}$/.test(code)) {
      this.state = 'MAIN_MENU';
      let contextAdvice = '';
      if (this.userContext === 'first-time') contextAdvice = "As a first-time voter, you may need to show ID when voting in person.";
      if (this.userContext === 'absentee') contextAdvice = "As an absentee voter, you can request a mail-in ballot online for this region.";
      if (this.userContext === 'student') contextAdvice = "As a student, you can choose to register at your campus address or your home address.";

      return `Great! For postal code ${code}: The deadline to register is 15 days before the election. You can register online at your local election portal. ${contextAdvice}\n\n(Type 'menu' to see options again)`;
    } else {
      return 'Please enter a valid 5 or 6-digit ZIP/PIN code.';
    }
  }

  handleTimeline(input) {
    this.state = 'MAIN_MENU';
    return 'Timeline handler...';
  }

  handleProcess(input) {
    this.state = 'MAIN_MENU';
    return 'Process handler...';
  }
}

module.exports = Chatbot;
