export interface Course {
    _id?: string;
    title: string;
    imageSrc: string;
  }
  
  export interface ActiveCourse {
    _id?: string;
    title: string;
    imageSrc: string;
  }
  
  export interface Unit {
    _id?: string;
    title: string;
    description: string;
    activeCourse: ActiveCourse;
    order: number; // Sửa lại từ 'oder' thành 'order'
    lessons?: Lesson[]; // Thêm thuộc tính lessons
  }
  
  export interface ActiveUnit {
    _id?: string;
    title: string;
    description: string;
    activeCourse: ActiveCourse;
  }
  
  export interface Lesson {
    _id?: string;
    title: string;
    activeUnit: ActiveUnit;
    order: number; // Sửa lại từ 'oder' thành 'order'
    challenges?: Challenge[]; // Thêm thuộc tính challenges
  }
  
  export type ChallengeType = "SELECT" | "ASSIST";
  
  export interface Challenge {
    _id?: string;
    activeLesson: ActiveLesson;
    type: ChallengeType;
    question: string;
    order: number;
    challengeProgresses?: ChallengeProgress[]; // Thêm thuộc tính challengeProgresses
  }
  
  export interface ActiveLesson {
    _id?: string;
    title: string;
    activeUnit: ActiveUnit;
    order: number; // Sửa lại từ 'oder' thành 'order'
  }
  
  export interface ChallengeOptions {
    _id?: string;
    activeChallenge: ActiveChallenge;
    text: string;
    correct: boolean;
    imageSrc: string;
    audioSrc: string;
  }
  
  export interface ActiveChallenge {
    _id?: string;
    activeLesson: ActiveLesson;
    type: ChallengeType;
    question: string;
    order: number;
  }
  
  export interface ChallengeProgress {
    _id?: string;
    email: string;
    activeChallenge: ActiveChallenge;
    completed: boolean;
  }
  
  export interface UserProgress {
    email : string;
    userName: string;
    userImageSrc: string;
    activeCourse: ActiveCourse;
    hearts: number;
    points: number;
  }
  