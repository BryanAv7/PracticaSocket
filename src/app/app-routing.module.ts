import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { HomeComponent } from './components/login/login.component';

const routes: Routes = [
  {
    path: 'login',
    component: HomeComponent
  },
  {
    path: 'chat/:userid',
    component: ChatComponent
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
