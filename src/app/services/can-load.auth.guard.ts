import { Injectable } from "@angular/core";
import {
  CanLoad,
  GuardResult,
  MaybeAsync,
  Route,
  Router,
  UrlSegment,
} from "@angular/router";
import { AuthStore } from "./auth.store";
import { first, tap } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable()
export class CanLoadAuthGuard implements CanLoad {
  constructor(private authStore: AuthStore, private router: Router) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.authStore.isLoggedIn$.pipe(
      first(),
      tap((loggedIn) => {
        if (!loggedIn) {
          this.router.navigateByUrl("/login");
        }
      })
    );
  }
}
