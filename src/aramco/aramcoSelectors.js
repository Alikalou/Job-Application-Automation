// The point of this entire file is to centralize HTML knowledge

export const ARAMCO_SELECTORS = {
    // -------------------------
    // Profile Information
    // -------------------------

    firstName:
        'input[name="firstName"]',

    middleName:
        'input[name="middleName"]',

    grandFatherName:
        'input[name="custGranf"]',

    lastName:
        'input[name="lastName"]',

    arabicFirstName:
        'input[name="first_name_alt1"]',

    arabicMiddleName:
        'input[name="middle_name_alt1"]',

    arabicGrandFatherName:
        'input[name="custArGranf"]',

    arabicLastName:
        'input[name="last_name_alt1"]',

    idNumber:
        'input[name="custIdNumber"]',

    gender:
        'select[name="gender"]',

    addressLine1:
        'input[name="address"]',

    city:
        'input[name="city"]',

    mobilePhone:
        'input[name="cellPhone"]',

    homePhone:
        'input[name="homePhone"]',

    email:
        'input[name="contactEmail"]',

    currentEmploymentCompany:
        'input[name="custCompany"]',

    nationalityType:
        'input[aria-label="Nationality Type"]',

    nationality:
        'input[aria-label="Nationality"]',

    idType:
        'input[aria-label="ID Type"]',

    maritalStatus:
        'input[aria-label="Marital Status"]',

    country:
        'input[aria-label="Country"]',

    countryCode:
        'input[aria-label="Country Code"]',

    birthDate:
        'ui5-date-picker-xweb-calendar-widget[title="Birth Date"] input[aria-label="Birth Date"]',

    // New profile selectors
    disabilityStatus:
        'input[aria-label="Disability Status"]',

    disabilityType:
        'input[aria-label="Disability Type"]',

    interviewAccommodation:
        'input[aria-label="Interview accommodation needs"]',

    preferredCommunication:
        'input[aria-label="Preferred method of Communication"]',

    stateProvince:
        'input[aria-label="State / Province"]',

    currentEmploymentStartDate:
        'input[aria-label="Start Date Current Employment"]',

    profileGpaScale:
        'input[aria-label="GPA Scale"]',

    profileGradingSystem:
        'input[aria-label="Grading System"]',

    profileTypeOfStudy:
        'input[aria-label="Type of Study"]',


    // -------------------------
    // Education
    // -------------------------

    degree:
        'input[aria-label="Degree"]',

    major:
        'input[aria-label="Major"]',

    otherMajor:
        'input[name="custOtherMajor"]',

    institution:
        'input[aria-label="Institution/University"]',

    otherInstitution:
        'input[name="custOtherSchool"]',

    gradingScale:
        'input[aria-label="How was your grade measured?"]',

    grade:
        'input[name="FFLD2"]',

    educationStartDate:
        'ui5-date-picker-xweb-calendar-widget[title="Start Date"] input[aria-label="Start Date"]',

    educationEndDate:
        'ui5-date-picker-xweb-calendar-widget[title="End Date"] input[aria-label="End Date"]',

    // -------------------------
    // Files
    // -------------------------

    resume:
        '.attachmentField:has(label:has-text("Resume/CV"))',

    coverLetter:
        '.attachmentField:has(label:has-text("Cover Letter"))',

    transcripts:
        '.attachmentField:has(label:has-text("Official transcript(s)"))',

    nationalIdCopy:
        '.attachmentField:has(label:has-text("National ID copy"))',

    addAttachmentButton:
        'span.addAttachments[role="button"]',

    fileInput:
        'input[type="file"].fileUpload',

    uploadSuccess:
        '.attachSuccessIcon',

    removeAttachmentButton:
        ".removeAttachments",

    confirmDeleteButton:
        'button[name="OK"]',

    // -------------------------
    // Language
    // -------------------------

    languageSection:
        '.rcmFormSection:has(.sectionTitle:has-text("Language Skills"))',

    languageRows:
        '.rcmSectionComponent',

    addLanguageRowButton:
        '.btnRowWrapper:has([aria-label="Language Skills"]) .addRowButton',

    language:
        'input[aria-label="Language"]',

    languageProficiency:
        'input[aria-label="Language Proficiency"]',

    // Save button
    saveButton:
        '.rcmAppBtnWrapper [id$="_saveBtn"]',
};