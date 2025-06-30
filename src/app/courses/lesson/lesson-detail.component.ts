import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LessonDetail } from "../model/lesson-detail";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "lesson",
  templateUrl: "./lesson-detail.component.html",
  styleUrls: ["./lesson-detail.component.css"],
  standalone: false,
})
export class LessonDetailComponent implements OnInit {
  lesson$: Observable<LessonDetail>;

  //lesson: LessonDetail;

  constructor(private route: ActivatedRoute) {
    console.log("Created LessonDetailComponent...");
  }

  ngOnInit() {
    this.lesson$ = of(this.route.snapshot.data["lesson"]);
  }
}
