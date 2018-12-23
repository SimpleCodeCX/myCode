import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { UserHttpService } from './http-service/user.http.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    UserHttpService // 在APP Module中注入UserHttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
