
export interface HomeContent {
    hero: {
        title: string;
        subtitle: string;
        cta: string;
    };
    navigation: {
        label: string;
        href: string;
    }[];
}

export interface PrinciplesContent {
    mainHeading: string;
    section1: {
        heading: string;
        description: string;
    };
    corePrinciples: {
        title: string;
        description: string;
    }[];
    section3: {
        heading: string;
        description: string;
    };
    section4: {
        heading: string;
        description: string;
    };
    section5: {
        heading: string;
        description: string;
    };
}

export interface BusinessContent {
    intro: string;
}

export interface PeopleContent {
    mainHeading: string;
    members: {
        name: string;
        role: string;
        bio: string;
        bio2?: string; // Optional per JSON analysis
        bio3?: string;
        bio4?: string;
        image: string;
    }[];
}

export interface ContactContent {
    companyName: string;
    email: string;
    phone: string;
    address1: string;
    address2: string;
    address3: string;
    consentText: string;
    formLine1Start: string;
    formLine1End: string;
    formLine2Start: string;
    formLine2End: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    buttonText: string;
}

export interface ServicesContent {
    items: {
        title: string;
        description: string;
        fullTitle?: string;
    }[];
}

export interface FullCMSContent {
    home: HomeContent;
    principles: PrinciplesContent;
    business: BusinessContent;
    people: PeopleContent;
    contact: ContactContent;
    services: ServicesContent;
}
