//import { Component, OnInit } from '@angular/core';
import { Input, Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CommService } from '../comm/comm.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  @Input()
  error: string | null;

  @Output()
  onLogin =new EventEmitter<boolean>();

  constructor(private commService: CommService) { }

  ngOnInit() {
    
  }

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  submit() {
    if (this.form.valid) {
      let uname = this.form.get('username').value;
      let pwd = this.form.get('password').value;

      this.commService.login(uname, pwd).then(res => {
        if (res) {
          //raise event login done
          this.error = "login success."
          this.onLogin.emit(true);
        } else {
          this.error = "login failed. Please try again."
        }
      }).catch(reason => this.error = reason);

    }
  }



}
