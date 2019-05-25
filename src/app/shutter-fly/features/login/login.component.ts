import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticateService } from 'src/app/shutter-fly/shared/services/authenticate.service';

@Component({
  selector: 'sb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  constructor(public fb: FormBuilder, public router: Router, public authenticateService: AuthenticateService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: [''],
      password: ['']
    });
  }
  submit() {
    this.authenticateService.authenticate(this.loginForm.value).subscribe((res: any) => {
      localStorage.setItem('token', res.tkn);
      localStorage.setItem('role', res.userRole);
      this.router.navigate(['shutterfly']);
    });

  }

}
