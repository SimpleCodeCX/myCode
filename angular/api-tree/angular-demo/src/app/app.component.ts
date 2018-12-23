import { Component } from '@angular/core';
import { UserHttpService } from './http-service/user.http.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'ApiTree';

  constructor(private userHttpService: UserHttpService) {
  }

  async getUserById(userId) {
    const userInfo = await this.userHttpService.getUserById(userId);
    alert(JSON.stringify(userInfo));
    console.log(userInfo);
  }

  async getUserByName(name) {
    const userInfo = await this.userHttpService.getUserByName(name);
    alert(JSON.stringify(userInfo));
    console.log(userInfo);
  }

  async getUserListByAge(age) {
    const userInfoList = await this.userHttpService.getUserListByAge(age);
    alert(JSON.stringify(userInfoList));
    console.log(userInfoList);
  }

}


class B { }
class A {
  constructor(b: B) { }
}
const b = new B();
const a = new A(b);