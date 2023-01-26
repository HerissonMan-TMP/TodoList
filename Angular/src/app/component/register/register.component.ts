import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User = { login: '', password: '' };
  error: boolean = false;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  submit(): void { 
    this.userService.register(this.user).subscribe({ 
      next: (data: any) => {
        this.router.navigate(['']);
      }, 
      error: () => { this.error = true; }
    });
  }

}
