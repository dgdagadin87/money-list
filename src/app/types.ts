export interface ValuteItem {
    ID: string;
    NumCode: string;
    CharCode: string;
    Nominal: number;
    Name: string;
    Value: number;
    Previous: number;
    NumOfMoney?: number;
};

export interface Response {
    Date: string;
    PreviousDate: string;
    PreviousURL: string;
    Timestamp: string;
    Valute: { [key: string]: ValuteItem };
};