export function calculateTimeAgo(lastOpened:number){
    const difference = Date.now() - lastOpened;
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(weeks / 4)

    if (seconds < 60) {return "just now";}
    if (minutes < 60) {return minutes.toString() + "m ago";}
    if (hours < 24) {return hours.toString() + "h ago";}
    if (days < 7) {return days.toString() + "d ago";}
    if (weeks < 4) {return weeks.toString() + "w ago";}
    return months.toString + "mo ago"
}