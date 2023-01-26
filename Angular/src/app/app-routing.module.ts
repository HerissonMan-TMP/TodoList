import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { TachesComponent } from './component/taches/taches.component';

const routes: Routes = [{ path: '', component: LoginComponent }, { path: 'register', component: RegisterComponent }, { path: 'taches', component: TachesComponent }];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
