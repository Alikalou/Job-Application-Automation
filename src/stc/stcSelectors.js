// The point of this entire file is to centralize STC's HTML knowledge

export const STC_SELECTORS = {
    // -------------------------
    // Profile Information
    // -------------------------

    firstName:
        'input[name="firstName"]',

    secondName:
        'input[name="middleName"]',

    thirdName:
        'input[name="custThirdName"]',

    lastName:
        'input[name="lastName"]',

    arabicFirstName:
        'input[name="custArFirstName"]',

    arabicSecondName:
        'input[name="custArMiddleName"]',

    arabicThirdName:
        'input[name="custArThirdName"]',

    arabicLastName:
        'input[name="custArLastName"]',

    idNumber:
        'input[name="custIdNumber"]',

    gender:
        'select[name="gender"]',

    address:
        'input[name="address"]',

    city:
        'input[name="city"]',

    mobilePhone:
        'input[name="cellPhone"]',

    homePhone:
        'input[name="homePhone"]',

    email:
        'input[name="contactEmail"]',

    company:
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

    resumeField:
        '.attachmentField:has(label:has-text("Resume/CV"))',

    coverLetterField:
        '.attachmentField:has(label:has-text("Cover Letter"))',

    addAttachmentButton:
        'span.addAttachments[role="button"]',

    fileInput:
        'input[type="file"].fileUpload',

    uploadSuccess:
        '.attachSuccessIcon',

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

    // -------------------------
    // Stc Specific
    // -------------------------

    stcEmployee: 'input[aria-label="Have you ever worked at stc group?"]',

    erpBeneficiary: 'input[aria-label="If yes Have you ever beneficiate from the ERP "]',

    workEligibility: 'input[aria-label="KSA Work Eligibility"]',

    disabilities: 'input[aria-label="Do you have any disabilities that we should be aware of?"]',

    confirmCommittee:
        'input[name="custConfirmCommittee"]',


    // Save button        
    saveButton:
        '.rcmAppBtnWrapper [id$="_saveBtn"]',

};