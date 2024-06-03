import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
    providedIn:"root"
})

export class RedirectGuard implements CanActivate{
    constructor(private router:Router){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        let user_id = sessionStorage.getItem("user_id")
        if(user_id && user_id!=undefined){
            // this.router.navigateByUrl("/dashboard")
            return true  
        }
        this.router.navigateByUrl("/verify")
        return false
    }
}