import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserType } from 'src/app/models/userType.model';
import { UserTypeService } from 'src/app/services/userType/user-type.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup

  public userTypes: UserType[]
  public chosenUserTypeId: Number

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userTypeService: UserTypeService,
    private userService: UserService
  ) {

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      userTypeId: [1, [Validators.required]]
    })
  }
  ngOnInit(): void {

    this.chosenUserTypeId = 1;

    /*this.userTypeService.fetchUserTypes().subscribe(userTypes => {
      this.userTypes = userTypes;
      console.log(userTypes);
    })*/
  }

  public get username() {
    return this.loginForm.get('username')
  }

  public get password() {
    return this.loginForm.get('password')
  }

  public get duration() {
    return this.loginForm.get('duration')
  }

  public submitForm(credentials) {

    this.userService.login(credentials).subscribe(data => {
      console.log('data ', data);
      this.router.navigate(['/home']);
    })
  }

}
