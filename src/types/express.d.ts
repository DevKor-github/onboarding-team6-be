import { Request } from 'express';

declare module 'express' {
  export interface Request {
    user?: any; // 사용자 정보를 여기에 저장할 수 있음, 타입을 User로 지정할 수도 있음
  }
}
