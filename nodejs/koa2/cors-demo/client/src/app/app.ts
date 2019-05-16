import { userService, UserInfo } from './@dataSource';

const containerEle = document.getElementById('container');

renderUserList();

// 渲染用户列表
async function renderUserList() {
  const ulEle = document.createElement('ul');
  const userList = await getAllUsers();
  userList.forEach((user: UserInfo) => {
    const liEle = document.createElement('li');
    liEle.innerText = `userId: ${user.userId} name: ${user.name} age: ${user.age} hobby: ${user.hobby}`;
    ulEle.appendChild(liEle);
  });
  containerEle.appendChild(ulEle);
}


// 获取用户数据
export async function getAllUsers(): Promise<Array<UserInfo>> {
  const resData = await userService.getAllUsers();
  if (resData.data.code !== 0) {
    return [];
  }
  console.log('getAllUsers: ', resData.data.data);
  return resData.data.data;
}




