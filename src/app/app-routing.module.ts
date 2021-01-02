import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import { EditTicketComponent } from './components/edit-ticket/edit-ticket.component';
import { CompanyComponent } from './components/company/company.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'user/page',
    component: UserPageComponent
  },
  {
    path: 'tickets/:id/edit',
    component: EditTicketComponent
  },
  {
    path: 'companies/:id',
    component: CompanyComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
