import { currentDateWithTime } from "./apiResponse";

export const getHistoryUpdate = (quotationStatus: string) => {
    let historyCommand = '';
    let historyStatus = '';

    switch (quotationStatus) {
        case 'Rejected':
            historyCommand = 'Quotation Rejected';
            historyStatus = 'Rejected';
            break;
        case 'Approved':
            historyCommand = 'Quotation Approved';
            historyStatus = 'Approved';
            break;
        case 'Send':
            historyCommand = 'Quotation Send';
            historyStatus = 'Sent';
            break;
        default:
            historyCommand = 'Unknown Status';
            historyStatus = quotationStatus;
    }

    return {
        historyCommand,
        historyDate: currentDateWithTime(),
        historyStatus
    };
};