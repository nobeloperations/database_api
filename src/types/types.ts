export interface FilteringParams {
    cohort?: string;
    courseCipher?: string;
}

export interface CourseCreateInput {
    courseName: string;
    courseCipher: string;
    linkToClassMaterials: string;
    startDate: Date;
    endDate: Date;
}


export interface CourseUpdateInput {
    courseName?: string;
    courseCipher?: string;
    linkToClassMaterials?: string;
    startDate?: Date;
    endDate?: Date;
}

export interface InternCourseCreateInput {
    courseId: number;
    internId: number;
    classRoleId: number;
}

export interface ClassEventCreateInput {
    meetNumber: number;
    eventDate: Date;
    googleMeetLink: string;
    courseId: number;
    classEventTypeId: number;
}

export interface ClassEventUpdateInput {
    meetNumber?: number;
    eventDate?: Date;
    googleMeetLink?: string;
    courseId?: number;
    classEventTypeId?: number;
};

export interface CourseResultCreateInput {
    internCourseId: number;
    masteryResult: string;
    englishLevel: string;
};

export interface CourseResultUpdateInput {
    internCourseId?: number;
    masteryResult?: string;
    englishLevel?: string;
};