export function getTimeUntil(dateString: string, showExact: boolean = false) {
  // Parse date more carefully
  let targetDate: Date;
  
  try {
    // Handle "Sep 16, 2025" format
    if (dateString.includes(',')) {
      targetDate = new Date(dateString.split(' ')[0] + ' ' + dateString.split(' ')[1] + ' ' + dateString.split(' ')[2]);
    } else {
      // Handle "Oct 2025" format
      targetDate = new Date(dateString + ' 1'); // Add day
    }
    
    // If still invalid, try direct parsing
    if (isNaN(targetDate.getTime())) {
      targetDate = new Date(dateString);
    }
    
    const now = new Date();
    const diffMs = targetDate.getTime() - now.getTime();
    
    if (diffMs < 0 || isNaN(diffMs)) {
      return null; // Past date or invalid
    }
    
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (showExact) {
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        return `${days}d ${hours}h`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    } else {
      // Rough countdown
      if (diffDays <= 1) {
        return '1 day';
      } else if (diffDays < 14) {
        return `${diffDays} days`;
      } else if (diffDays < 60) {
        const weeks = Math.ceil(diffDays / 7);
        return `${weeks} week${weeks !== 1 ? 's' : ''}`;
      } else {
        const months = Math.ceil(diffDays / 30);
        return `${months} month${months !== 1 ? 's' : ''}`;
      }
    }
  } catch (error) {
    return null;
  }
}