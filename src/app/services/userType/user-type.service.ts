import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { UserType } from 'src/app/models/userType.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class UserTypeService {

  private readonly baseUrl = "http://localhost:8080/user/types";

  private userTypes: Observable<UserType[]>

  constructor(private http: HttpClient) { }

  public getUserTypes() {
    if (this.userTypes == undefined) {
      this.fetchUserTypes();
    }

    return this.userTypes;
  }

  fetchUserTypes() {
    this.userTypes = this.http.get<UserType[]>(this.baseUrl, {
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('JWT')
      }
    });

    return this.userTypes;
  }
}
