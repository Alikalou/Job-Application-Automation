import { ARAMCO_SELECTORS } from "./aramcoSelectors.js";

function mapGender(gender) {
    const normalized = gender.toLowerCase();

    if (normalized === "male") {
        return "M";
    }

    if (normalized === "female") {
        return "F";
    }

    return "U";
}

export const ATTACHMENT_FIELDS = [
    {
        selector: ARAMCO_SELECTORS.resume,
        key: "cvPdf",
        label: "Resume/CV",
    },
    {
        selector: ARAMCO_SELECTORS.coverLetter,
        key: "coverLetter",
        label: "Cover Letter",
    },
    {
        selector: ARAMCO_SELECTORS.nationalIdCopy,
        key: "nationalIdCopy",
        label: "National ID Copy",
    },
    {
        selector: ARAMCO_SELECTORS.certificates,
        key: "certificates",
        label: "Certificates",
    },
    {
        selector: ARAMCO_SELECTORS.transcripts,
        key: "transcripts",
        label: "Transcripts",
    },
    {
        selector: ARAMCO_SELECTORS.driversLicense,
        key: "driversLicense",
        label: "Driver's License",
    },
    {
        selector: ARAMCO_SELECTORS.familyBooklet,
        key: "familyBooklet",
        label: "Family Booklet",
    },
    {
        selector: ARAMCO_SELECTORS.studentId,
        key: "studentId",
        label: "Student ID",
    },
    {
        selector: ARAMCO_SELECTORS.experienceLetters,
        key: "experienceLetters",
        label: "Experience Letters",
    },
    {
        selector: ARAMCO_SELECTORS.disabilityCertificate,
        key: "disabilityCertificate",
        label: "Disability Certificate",
    },
];

export const PROFILE_FIELDS = [
    // Names
    {
        type: "input",
        selector: ARAMCO_SELECTORS.firstName,
        key: "firstName",
    },
    {
        type: "input",
        selector: ARAMCO_SELECTORS.middleName,
        key: "middleName",
    },
    {
        type: "input",
        selector: ARAMCO_SELECTORS.lastName,
        key: "lastName",
    },

    // Arabic Names
    {
        type: "input",
        selector: ARAMCO_SELECTORS.arabicFirstName,
        key: "arabicFirstName",
    },
    {
        type: "input",
        selector: ARAMCO_SELECTORS.arabicMiddleName,
        key: "arabicMiddleName",
    },
    {
        type: "input",
        selector: ARAMCO_SELECTORS.arabicLastName,
        key: "arabicLastName",
    },
    {
        type: "input",
        selector: ARAMCO_SELECTORS.arabicGrandFatherName,
        key: "arabicGrandFatherName",
    },


    {
        type: "input",
        selector: ARAMCO_SELECTORS.grandFatherName,
        key: "grandFatherName",
    },

    // Disability
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.disabilityStatus,
        key: "disabilityStatus",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.disabilityType,
        key: "disabilityType",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.interviewAccommodation,
        key: "interviewAccommodation",
    },

    // Communication
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.preferredCommunication,
        key: "preferredCommunication",
    },
    {
        type: "input",
        selector: ARAMCO_SELECTORS.preferredCommunicationOther,
        key: "preferredCommunicationOther",
    },

    // Personal Information
    {
        type: "select",
        selector: ARAMCO_SELECTORS.gender,
        key: "gender",
        transform: mapGender,
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.maritalStatus,
        key: "maritalStatus",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.nationality,
        key: "nationality",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.idType,
        key: "idType",
    },
    {
        type: "input",
        selector: ARAMCO_SELECTORS.idNumber,
        key: "idNumber",
    },
    {
        type: "input",
        selector: ARAMCO_SELECTORS.birthDate,
        key: "birthDate",
    },

    // Address
    {
        type: "input",
        selector: ARAMCO_SELECTORS.addressLine1,
        key: "addressLine1",
    },
    {
        type: "input",
        selector: ARAMCO_SELECTORS.addressLine2,
        key: "addressLine2",
    },
    {
        type: "input",
        selector: ARAMCO_SELECTORS.city,
        key: "city",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.country,
        key: "country",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.stateProvince,
        key: "stateProvince",
    },
    {
        type: "input",
        selector: ARAMCO_SELECTORS.postalCode,
        key: "postalCode",
    },

    // Contact Information
    {
        type: "input",
        selector: ARAMCO_SELECTORS.mobilePhone,
        key: "phone",
    },
    {
        type: "input",
        selector: ARAMCO_SELECTORS.homePhone,
        key: "homePhone",
    },
    {
        type: "input",
        selector: ARAMCO_SELECTORS.email,
        key: "email",
    },

    // Current Employment
    {
        type: "input",
        selector: ARAMCO_SELECTORS.currentEmploymentTitle,
        key: "currentEmploymentTitle",
    },
    {
        type: "input",
        selector: ARAMCO_SELECTORS.currentEmploymentCompany,
        key: "currentEmploymentCompany",
    },
    {
        type: "input",
        selector: ARAMCO_SELECTORS.currentEmploymentStartDate,
        key: "currentEmploymentStartDate",
    },

    // Education Summary
    {
        type: "input",
        selector: ARAMCO_SELECTORS.profileGpa,
        key: "grade",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.profileGpaScale,
        key: "gradingScale",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.profileGradingSystem,
        key: "gradingSystem",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.profileTypeOfStudy,
        key: "typeOfStudy",
    },
];

export const EMPLOYMENT_FIELDS = [
    {
        type: "input",
        selector: ARAMCO_SELECTORS.employmentStartDate,
        key: "startDate",
    },
    {
        type: "input",
        selector: ARAMCO_SELECTORS.employmentEndDate,
        key: "endDate",
    },
    {
        type: "input",
        selector: ARAMCO_SELECTORS.companyName,
        key: "companyName",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.businessType,
        key: "businessType",
    },
    {
        type: "input",
        selector: ARAMCO_SELECTORS.jobTitle,
        key: "title",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.employmentCountry,
        key: "country",
    },
];

export const EDUCATION_FIELDS = [
    {
        type: "input",
        selector: ARAMCO_SELECTORS.educationStartDate,
        key: "startDate",
    },
    {
        type: "input",
        selector: ARAMCO_SELECTORS.educationEndDate,
        key: "endDate",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.level,
        key: "level",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.degree,
        key: "degree",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.discipline,
        key: "discipline",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.major,
        key: "major",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.location,
        key: "location",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.institution,
        key: "institution",
    },
    {
        type: "input",
        selector: ARAMCO_SELECTORS.otherInstitution,
        key: "otherInstitution",
    },
    {
        type: "input",
        selector: ARAMCO_SELECTORS.institutionWebsite,
        key: "institutionWebsite",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.programType,
        key: "programType",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.gradingSystem,
        key: "gradingSystem",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.degreeClass,
        key: "degreeClass",
    },
    {
        type: "input",
        selector: ARAMCO_SELECTORS.grade,
        key: "grade",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.gradingScale,
        key: "gradingScale",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.typeOfStudy,
        key: "typeOfStudy",
    },
];

export const LANGUAGE_FIELDS = [
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.language,
        key: "language",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.languageVariant,
        key: "languageVariant",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.speakingProficiency,
        key: "speakingProficiency",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.readingProficiency,
        key: "readingProficiency",
    },
    {
        type: "combobox",
        selector: ARAMCO_SELECTORS.writingProficiency,
        key: "writingProficiency",
    },
];


export const JOB_SPECIFIC_FIELDS = [];