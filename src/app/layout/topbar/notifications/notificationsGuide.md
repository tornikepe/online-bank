##How to push notifications to notifications menu

first import `GetnotfsService` into your projects constructor:
```javascript
private getnotfsService: GetnotfsService
```

after that you can access it by typing following:

```javascript
this.getnotfsService.addNotf({
userId: localStorage.getItem('userId'), //passes id of current user
title: 'card deleted', //title of the notification
value: 'card has been deleted from your account and it cannot be restored', //value text of the notification
link: 'accounts' //this one is optional, you can pass desired path, this will redirect to localhost:4200/accounts 
})
```

**goodluck ;)**