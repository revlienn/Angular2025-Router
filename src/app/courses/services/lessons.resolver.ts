import {
  ActivatedRouteSnapshot,
  MaybeAsync,
  RedirectCommand,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { LessonSummary } from "../model/lesson-summary";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CoursesService } from "./courses.service";

@Injectable()
export class LessonsResolver implements Resolve<LessonSummary[]> {
  constructor(private courses: CoursesService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<LessonSummary[]> {
    const courseUrl = route.paramMap.get("courseUrl");
    return this.courses.loadAllCourseLessonsSummary(courseUrl);
  }
}
