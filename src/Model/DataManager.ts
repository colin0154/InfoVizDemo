import { FeatureCollection } from "geojson";

export class DataManager {
    //#region Property
    private static instance: DataManager;

    private geoJson: FeatureCollection;
    private dataset: Map<string, any>;

    // Global States
    private selectedYear: number;
    private selectedCountry: string;
    private selectedField: DataManager.Field;

    private readonly event: Event;
    private readonly EventTarget: HTMLElement;
    //#endregion

    private readonly countryISO: any;

    private constructor(){
        this.selectedYear = 2016;
        this.selectedCountry = "CHN";
        this.selectedField = DataManager.Field.Mean;

        this.event = new Event("StateChanged")
        this.EventTarget = document.getElementById("EventTarget");

        this.countryISO = this.setCountryISO();
    }

    public static get Instance(): DataManager {
        if (!DataManager.instance) {
            DataManager.instance = new DataManager();
        }

        return DataManager.instance;
    }

    public Initialize(data: Array<any>): void {
        if (this.geoJson != null || this.dataset != null) {
            console.log("Warning: Data has already been set.");
            return;
        }

        this.geoJson = data[0];
        // Reverse from Array to Map.
        this.dataset = new Map(data[1]);
    }

    //#region Data Accessor
    public get GeoJson(): FeatureCollection {
        return this.geoJson;
    }

    public get SelectedCountry(): string {
        return this.selectedCountry;
    }

    public get SelectedYear(): number {
        return this.selectedYear;
    }
    
    public get SelectedField(): DataManager.Field {
        return this.selectedField;
    }
    
    public GetFieldValue(code: string = this.selectedCountry): number {
        const country: any = this.dataset.get(code);
        const year: number = this.selectedYear - 1975;
        const field: string = this.getSelectedField();
        
        return country[field][year];
    }

    // Return the country's all data from current field since 1975.
    public GetFieldValueAllYear(): Array<number> {
        const country: any = this.dataset.get(this.selectedCountry);
        const field: string = this.getSelectedField();

        return country[field];
    }

    public GetPopulation(code: string = this.selectedCountry): number{
        const country: any = this.dataset.get(code);
        const year: number = this.selectedYear - 1975;

        return country["Population"][year];
    }

    public GetGDPPerCapita(code: string = this.selectedCountry) {
        const country: any = this.dataset.get(code);
        const year: number = this.selectedYear - 1990;

        return country["GDPPerCapita"][year];
    }

    public GetCountryList(): any {
        return this.dataset.keys();
    }

    public GetCountryName(code: string = this.selectedCountry): string {
        if (this.dataset.get(code) == null){
            return;
        }

        return this.dataset.get(code)["Name"];
    }

    public GetCountryCodeA2(code: string = this.selectedCountry): string {
        return this.countryISO[code];
    }
    //#endregion

    //#region State Setter
    public ChangeYear(year: number): void {
        if (year < 1975 || year > 2016) {
            console.log("Warning: DataManager don't have year " + year);
            return;
        }

        this.selectedYear = year;
        this.EventTarget.dispatchEvent(this.event);
    }

    public ChangeField(field: DataManager.Field): void {
        this.selectedField = field;
        this.EventTarget.dispatchEvent(this.event);
    }

    public ChangeCountry(code: string): void {
        if (!this.GetCountryName(code)) {
            console.log("Warning: Invalid country code.")
            return;
        }

        this.selectedCountry = code;
        this.EventTarget.dispatchEvent(this.event);
    }
    //#endregion

    //#region Helper Function
    // Return the property name.
    private getSelectedField(): string {
        switch (this.selectedField) {
            case DataManager.Field.Mean:
                return "Mean";
                break;
            case DataManager.Field.Underweight:
                return "Underweight";
                break;
            case DataManager.Field.Obesity:
                return "Obesity";
                break;
            case DataManager.Field.Severe:
                return "Severe";
                break;
            case DataManager.Field.Morbid:
                return "Morbid";
                break;
        }
    }
    //#endregion

    private setCountryISO(): any {
        // Credit to @vtex/country-iso-2-to-3
        // https://github.com/vtex/country-iso-2-to-3
        return {
            AFG: "AF",
            ALA: "AX",
            ALB: "AL",
            DZA: "DZ",
            ASM: "AS",
            AND: "AD",
            AGO: "AO",
            AIA: "AI",
            ATA: "AQ",
            ATG: "AG",
            ARG: "AR",
            ARM: "AM",
            ABW: "AW",
            AUS: "AU",
            AUT: "AT",
            AZE: "AZ",
            BHS: "BS",
            BHR: "BH",
            BGD: "BD",
            BRB: "BB",
            BLR: "BY",
            BEL: "BE",
            BLZ: "BZ",
            BEN: "BJ",
            BMU: "BM",
            BTN: "BT",
            BOL: "BO",
            BIH: "BA",
            BWA: "BW",
            BVT: "BV",
            BRA: "BR",
            VGB: "VG",
            IOT: "IO",
            BRN: "BN",
            BGR: "BG",
            BFA: "BF",
            BDI: "BI",
            KHM: "KH",
            CMR: "CM",
            CAN: "CA",
            CPV: "CV",
            CYM: "KY",
            CAF: "CF",
            TCD: "TD",
            CHL: "CL",
            CHN: "CN",
            HKG: "HK",
            MAC: "MO",
            CXR: "CX",
            CCK: "CC",
            COL: "CO",
            COM: "KM",
            COG: "CG",
            COD: "CD",
            COK: "CK",
            CRI: "CR",
            CIV: "CI",
            HRV: "HR",
            CUB: "CU",
            CYP: "CY",
            CZE: "CZ",
            DNK: "DK",
            DJI: "DJ",
            DMA: "DM",
            DOM: "DO",
            ECU: "EC",
            EGY: "EG",
            SLV: "SV",
            GNQ: "GQ",
            ERI: "ER",
            EST: "EE",
            ETH: "ET",
            FLK: "FK",
            FRO: "FO",
            FJI: "FJ",
            FIN: "FI",
            FRA: "FR",
            GUF: "GF",
            PYF: "PF",
            ATF: "TF",
            GAB: "GA",
            GMB: "GM",
            GEO: "GE",
            DEU: "DE",
            GHA: "GH",
            GIB: "GI",
            GRC: "GR",
            GRL: "GL",
            GRD: "GD",
            GLP: "GP",
            GUM: "GU",
            GTM: "GT",
            GGY: "GG",
            GIN: "GN",
            GNB: "GW",
            GUY: "GY",
            HTI: "HT",
            HMD: "HM",
            VAT: "VA",
            HND: "HN",
            HUN: "HU",
            ISL: "IS",
            IND: "IN",
            IDN: "ID",
            IRN: "IR",
            IRQ: "IQ",
            IRL: "IE",
            IMN: "IM",
            ISR: "IL",
            ITA: "IT",
            JAM: "JM",
            JPN: "JP",
            JEY: "JE",
            JOR: "JO",
            KAZ: "KZ",
            KEN: "KE",
            KIR: "KI",
            PRK: "KP",
            KOR: "KR",
            KWT: "KW",
            KGZ: "KG",
            LAO: "LA",
            LVA: "LV",
            LBN: "LB",
            LSO: "LS",
            LBR: "LR",
            LBY: "LY",
            LIE: "LI",
            LTU: "LT",
            LUX: "LU",
            MKD: "MK",
            MDG: "MG",
            MWI: "MW",
            MYS: "MY",
            MDV: "MV",
            MLI: "ML",
            MLT: "MT",
            MHL: "MH",
            MTQ: "MQ",
            MRT: "MR",
            MUS: "MU",
            MYT: "YT",
            MEX: "MX",
            FSM: "FM",
            MDA: "MD",
            MCO: "MC",
            MNG: "MN",
            MNE: "ME",
            MSR: "MS",
            MAR: "MA",
            MOZ: "MZ",
            MMR: "MM",
            NAM: "NA",
            NRU: "NR",
            NPL: "NP",
            NLD: "NL",
            ANT: "AN",
            NCL: "NC",
            NZL: "NZ",
            NIC: "NI",
            NER: "NE",
            NGA: "NG",
            NIU: "NU",
            NFK: "NF",
            MNP: "MP",
            NOR: "NO",
            OMN: "OM",
            PAK: "PK",
            PLW: "PW",
            PSE: "PS",
            PAN: "PA",
            PNG: "PG",
            PRY: "PY",
            PER: "PE",
            PHL: "PH",
            PCN: "PN",
            POL: "PL",
            PRT: "PT",
            PRI: "PR",
            QAT: "QA",
            REU: "RE",
            ROU: "RO",
            RUS: "RU",
            RWA: "RW",
            BLM: "BL",
            SHN: "SH",
            KNA: "KN",
            LCA: "LC",
            MAF: "MF",
            SPM: "PM",
            VCT: "VC",
            WSM: "WS",
            SMR: "SM",
            STP: "ST",
            SAU: "SA",
            SEN: "SN",
            SRB: "RS",
            SYC: "SC",
            SLE: "SL",
            SGP: "SG",
            SVK: "SK",
            SVN: "SI",
            SLB: "SB",
            SOM: "SO",
            ZAF: "ZA",
            SGS: "GS",
            SSD: "SS",
            ESP: "ES",
            LKA: "LK",
            SDN: "SD",
            SUR: "SR",
            SJM: "SJ",
            SWZ: "SZ",
            SWE: "SE",
            CHE: "CH",
            SYR: "SY",
            TWN: "TW",
            TJK: "TJ",
            TZA: "TZ",
            THA: "TH",
            TLS: "TL",
            TGO: "TG",
            TKL: "TK",
            TON: "TO",
            TTO: "TT",
            TUN: "TN",
            TUR: "TR",
            TKM: "TM",
            TCA: "TC",
            TUV: "TV",
            UGA: "UG",
            UKR: "UA",
            ARE: "AE",
            GBR: "GB",
            USA: "US",
            UMI: "UM",
            URY: "UY",
            UZB: "UZ",
            VUT: "VU",
            VEN: "VE",
            VNM: "VN",
            VIR: "VI",
            WLF: "WF",
            ESH: "EH",
            YEM: "YE",
            ZMB: "ZM",
            ZWE: "ZW"
          }
    }
}

//#region Enums
// This is a workaround to use enum in a Typscript Class.
export namespace DataManager {
    export enum Field {
        Mean,
        Underweight,
        Obesity,
        Severe,
        Morbid
    }
}
//#endregion
