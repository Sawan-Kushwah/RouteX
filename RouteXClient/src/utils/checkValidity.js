function checkDateStatus(dateStr, warningDays) {
    // Convert DD-MM-YYYY → JS Date (YYYY-MM-DD)
    const [day, month, year] = dateStr.split("-").map(Number);
    const targetDate = new Date(year, month - 1, day);

    // Today's date without time (to avoid timezone issues)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = targetDate - today;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
        return "expired";
    }

    if (daysLeft <= warningDays) {
        return "warning";
    }

    return "true"; // or "ok"
}

export default checkDateStatus