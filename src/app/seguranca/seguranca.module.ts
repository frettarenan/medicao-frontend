import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthGuard } from './auth.guard';
import { LoginFormComponent } from './login-form/login-form.component';
import { LogoutService } from './logout.service';
import { SegurancaRoutingModule } from './seguranca-routing.module';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MDBBootstrapModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      }
    }),
    InputTextModule,
    ButtonModule,

    SegurancaRoutingModule
  ],
  declarations: [LoginFormComponent],
  providers: [
    AuthGuard,
    LogoutService
  ]
})
export class SegurancaModule { }
