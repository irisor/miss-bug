import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { useEffect, useState } from 'react'
import { userService } from '../services/user'
import { UserList } from '../cmps/UserList.jsx'


export function UserIndex() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    const users = await userService.query()
    setUsers(users)
  }

  async function onRemoveUser(userId) {
    try {
      await userService.remove(userId)
      console.log('Deleted Succesfully!')
      setUsers(prevUsers => prevUsers.filter((user) => user._id !== userId))
      showSuccessMsg('User removed')
    } catch (err) {
      console.log('Error from onRemoveUser ->', err)
      showErrorMsg('Cannot remove user')
    }
  }

  async function onAddUser() {
    const user = {
      fullname: prompt('User fullname?'),
      username: prompt('User username?'),
      password: prompt('User password?'),
      score: +prompt('User score?'),
    }
    try {
      const savedUser = await userService.save(user)
      console.log('Added User', savedUser)
      setUsers(prevUsers => [...prevUsers, savedUser])
      showSuccessMsg('User added')
    } catch (err) {
      console.log('Error from onAddUser ->', err)
      showErrorMsg('Cannot add user')
    }
  }

  async function onEditUser(user) {
    let score = prompt('New score?', user?.score);
    if (score === null) {
      return;
    }
    score = +score;

    const fullname = prompt('New fullname?', user?.fullname);
    if (fullname === null) { return; }

    const username = prompt('New username?', user?.username);
    if (username === null) { return; }

    const password = prompt('New password?', user?.password);
    if (password === null) { return; }

    
    const userToSave = { ...user, fullname, username, password, score }
    try {

      const savedUser = await userService.save(userToSave)
      setUsers(prevUsers => prevUsers.map((currUser) =>
        currUser._id === savedUser._id ? savedUser : currUser
      ))
      showSuccessMsg('User updated')
    } catch (err) {
      console.log('Error from onEditUser ->', err)
      showErrorMsg('Cannot update user')
    }
  }

  return (
    <main className="user-index">
      <h1>Users</h1>
      <main>
        <button className='add-btn' onClick={onAddUser}>Add User ⛐</button>
        <UserList users={users} onRemoveUser={onRemoveUser} onEditUser={onEditUser} />
      </main>
    </main>
  )
}
