import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User = { login: '', password: '' };
  error: boolean = false;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  submit(): void { 
    this.userService.login(this.user).subscribe({ 
      next: (data: any) => {
        document.cookie = `user=${data.userId};`;
        this.router.navigate(['taches'])
      }, 
      error: () => { this.error = true; } });
     }

}
