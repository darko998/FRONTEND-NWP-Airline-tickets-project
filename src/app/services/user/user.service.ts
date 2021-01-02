import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly baseUrl = "http://localhost:8080/users";

  private userTypes: Observable<User[]>
  private newUser: Observable<User>

  constructor(private http: HttpClient) { }

  login(user) {
    return this.http.get(this.baseUrl + "/login", {
      params: {
        username: user.username,
        password: user.password,
        userTypeId: user.userType
      }
    }).pipe(map((response: User) => {
      console.log(response);

      if (response != null) {
        localStorage.setItem('JWT', response.jwt);
        localStorage.setItem('username', response.username);
        localStorage.setItem('userId', response.id.toString())
        localStorage.setItem('userType', response.userType.toString());
      }

    }))
  }

  public addUser(user: User) {
    this.newUser = this.http.post<User>(this.baseUrl, user, {
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('JWT')
      }
    });

    return this.newUser;
  }
}
