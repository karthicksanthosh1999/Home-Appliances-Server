class DateFormatter {
    static formatCurrentDate(): string {
        const now = new Date();

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short'
        };

        const formattedDate = now.toLocaleDateString('en-US', options);
        return formattedDate;
    }
}

export const dateFormtter = new DateFormatter();