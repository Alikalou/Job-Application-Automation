import { STC_SELECTORS } from "./stcSelectors.js";

function mapGender(gender) {
    const normalized =
        gender.toLowerCase();

    if (normalized === "male") {
        return "M";
    }

    if (normalized === "female") {
        return "F";
    }

    return "U";
}

export const PROFILE_FIELDS = [
    // -------------------------
    // Names
    // -------------------------

    {
        type: "input",
        selector: STC_SELECTORS.firstName,
        key: "firstName",
    },
    {
        type: "input",
        selector: STC_SELECTORS.secondName,
        key: "secondName",
    },
    {
        type: "input",
        selector: STC_SELECTORS.thirdName,
        key: "thirdName",
    },
    {
        type: "input",
        selector: STC_SELECTORS.lastName,
        key: "lastName",
    },

    // -------------------------
    // Arabic Names
    // -------------------------

    {
        type: "input",
        selector: STC_SELECTORS.arabicFirstName,
        key: "arabicFirstName",
    },
    {
        type: "input",
        selector: STC_SELECTORS.arabicSecondName,
        key: "arabicSecondName",
    },
    {
        type: "input",
        selector: STC_SELECTORS.arabicThirdName,
        key: "arabicThirdName",
    },
    {
        type: "input",
        selector: STC_SELECTORS.arabicLastName,
        key: "arabicLastName",
    },

    // -------------------------
    // Identification
    // -------------------------

    {
        type: "combobox",
        selector: STC_SELECTORS.nationalityType,
        key: "nationalityType",
    },
    {
        type: "combobox",
        selector: STC_SELECTORS.nationality,
        key: "nationality",
    },
    {
        type: "combobox",
        selector: STC_SELECTORS.idType,
        key: "idType",
    },
    {
        type: "input",
        selector: STC_SELECTORS.idNumber,
        key: "idNumber",
    },

    // -------------------------
    // Personal Information
    // -------------------------

    {
        type: "select",
        selector: STC_SELECTORS.gender,
        key: "gender",
        transform: mapGender,
    },
    {
        type: "combobox",
        selector: STC_SELECTORS.maritalStatus,
        key: "maritalStatus",
    },
    {
        type: "input",
        selector: STC_SELECTORS.birthDate,
        key: "birthDate",
    },

    // -------------------------
    // Address
    // -------------------------

    {
        type: "input",
        selector: STC_SELECTORS.city,
        key: "city",
    },
    {
        type: "combobox",
        selector: STC_SELECTORS.country,
        key: "country",
    },

    // -------------------------
    // Contact Information
    // -------------------------

    {
        type: "combobox",
        selector: STC_SELECTORS.countryCode,
        key: "countryCode",
    },
    {
        type: "input",
        selector: STC_SELECTORS.mobilePhone,
        key: "phone",
    },
    {
        type: "input",
        selector: STC_SELECTORS.email,
        key: "email",
    },

];


export const EDUCATION_FIELDS = [
    {
        type: "combobox",
        selector: STC_SELECTORS.degree,
        key: "degree",
    },
    {
        type: "combobox",
        selector: STC_SELECTORS.major,
        key: "major",
    },
    {
        type: "input",
        selector: STC_SELECTORS.otherMajor,
        key: "otherMajor",
    },
    {
        type: "combobox",
        selector: STC_SELECTORS.institution,
        key: "institution",
    },
    {
        type: "input",
        selector: STC_SELECTORS.otherInstitution,
        key: "otherInstitution",
    },
    {
        type: "combobox",
        selector: STC_SELECTORS.gradingScale,
        key: "gradingScale",
        transform: value => `0 - ${value}`
    },
    {
        type: "input",
        selector: STC_SELECTORS.grade,
        key: "grade",
    },
    {
        type: "input",
        selector: STC_SELECTORS.educationStartDate,
        key: "startDate",
    },
    {
        type: "input",
        selector: STC_SELECTORS.educationEndDate,
        key: "endDate",
    },
];


export const LANGUAGE_FIELDS = [
    {
        type: "combobox",
        selector: STC_SELECTORS.language,
        key: "language",
    },
    {
        type: "combobox",
        selector: STC_SELECTORS.languageProficiency,
        key: "languageProficiency",
    },
];

export const JOB_SPECIFIC_FIELDS = [
    {
        type: "combobox",
        selector: STC_SELECTORS.stcEmployee,
        key: "stcEmployee",
    },
    {
        type: "combobox",
        selector: STC_SELECTORS.erpBeneficiary,
        key: "erpBeneficiary",
    },
    {
        type: "combobox",
        selector: STC_SELECTORS.workEligibility,
        key: "workEligibility",
    },
    {
        type: "combobox",
        selector: STC_SELECTORS.disabilities,
        key: "disabilities",
    },
    {
        type: "checkbox",
        selector: STC_SELECTORS.confirmCommittee,
        key: "confirmCommittee",
    },
];
