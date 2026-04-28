function addToCalendar(eventName, date) {
  const currentYear = new Date().getFullYear();
  // Calculate First Tuesday of Nov for General Election if no date provided
  const targetDateStr = date || `${currentYear}1103T120000Z/${currentYear}1103T130000Z`; 
  
  // Create a real Google Calendar Event link 
  // This does not require an API key to generate, but requires the user to click it.
  // This is the optimal way to handle calendar injections for a chatbot without OAuth.
  const encodedName = encodeURIComponent(eventName);
  const encodedDetails = encodeURIComponent("VoterSphere Reminder: It's Election Day! Make sure you go vote.");
  
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedName}&dates=${targetDateStr}&details=${encodedDetails}`;
  
  return `Click the link below to add "${eventName}" directly to your Google Calendar:\n\n<a href="${calendarUrl}" target="_blank">📅 Add to Google Calendar</a>`;
}

module.exports = {
  addToCalendar
};
